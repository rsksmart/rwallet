import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text, TouchableOpacity, View, StyleSheet, Image, Clipboard, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import { createTransaction } from '../../../common/transaction';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import parseHelper from '../../../common/parse';
import color from '../../../assets/styles/color';
import { strings } from '../../../common/i18n';
import Button from '../../../components/common/button/button';
import references from '../../../assets/references';
import { createInfoNotification, getErrorNotification, getDefaultErrorNotification } from '../../../common/notification.controller';
import { createInfoConfirmation } from '../../../common/confirmation.controller';
import ResponsiveText from '../../../components/common/misc/responsive.text';
import common from '../../../common/common';
import { PROPOSAL_STATUS } from '../../../common/constants';
import space from '../../../assets/styles/space';
import txStyles from '../../../assets/styles/transaction.styles';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 10,
  },
  sectionContainer: {
    paddingHorizontal: 25,
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: color.black,
    marginBottom: 10,
  },
  amountText: {
    color: color.black,
    fontWeight: '400',
  },
  assetValue: {
    fontSize: 17,
  },
  symbol: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 5,
  },
  stateIcon: {
    alignSelf: 'center',
    right: 0,
    position: 'absolute',
  },
  copyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    flex: 1,
    color: color.app.theme,
  },
  copyIcon: {
    marginLeft: 4,
    marginBottom: 2,
  },
  delete: {
    color: color.warningText,
    fontWeight: '500',
  },
  deleteView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  deletedNotice: {
    backgroundColor: '#fef8f2',
    color: '#f6bc5a',
    marginHorizontal: 25,
    paddingVertical: 9,
    textAlign: 'center',
  },
  numberView: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: color.app.theme,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  operationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    color: color.app.theme,
  },
  operationColumn: {
    marginLeft: 10,
    flex: 1,
  },
  operationText: {
    fontFamily: 'Avenir-Heavy',
  },
  reject: {
    color: color.warningText,
  },
});

class MultisigProposalDetail extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { token, proposal } = props.navigation.state.params;
      this.token = token;
      this.proposal = proposal;
      this.state = {
        dateTimeText: null,
        to: null,
        from: null,
        amountText: null,
        feesText: null,
        isLoading: false,
        status: null,
        isOperatedUser: false,
        operationSequence: [],
        assetValue: null,
      };
    }

    componentDidMount() {
      this.processProposal();
      this.refreshProposal();
    }

    componentWillReceiveProps(nextProps) {
      const { updateTimestamp: lastUpdateTimeStamp } = this.props;
      const { proposal, token } = this;
      const { updateTimestamp } = nextProps;
      if (lastUpdateTimeStamp !== updateTimestamp) {
        if (token.proposal && token.proposal.objectId === proposal.objectId && token.proposal.updatedAt > proposal.updatedAt) {
          this.proposal = token.proposal;
          this.processProposal();
        }
      }
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
    }

    refreshProposal = async () => {
      console.log('refreshProposal, this.proposal: ', this.proposal);
      const { objectId } = this.proposal;
      try {
        const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.getProposal(objectId), this);
        this.proposal = proposal;
        this.processProposal();
        this.updateProposal(proposal);
      } catch (error) {
        console.warn('refreshProposal, error: ', error);
      }
    }

    generateOperationSequence = (acceptedMembers, rejectedMembers) => {
      let allOperations = [...acceptedMembers, ...rejectedMembers];
      allOperations = allOperations.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
      return allOperations;
    }

    processProposal = async () => {
      const { proposal } = this;
      const { prices, currency } = this.props;
      const {
        type, createdAt, rawTransaction, status, memo,
      } = proposal;
      const user = await parseHelper.getUser();
      const username = user.get('username');
      const symbol = 'BTC';

      const dateTimeText = moment(createdAt).format('LLL');
      const from = rawTransaction.tx.addresses[0];
      const to = rawTransaction.tx.addresses[1];
      const feesValue = rawTransaction.tx.fees;

      const amountValue = rawTransaction.tx.outputs[0].value;
      const amount = common.convertUnitToCoinAmount(symbol, amountValue);
      const amountText = `${common.getBalanceString(amount, symbol)} ${common.getSymbolName(symbol, type)}`;

      const fees = common.convertUnitToCoinAmount(symbol, feesValue);
      const feesText = `${common.getBalanceString(fees, symbol)} ${common.getSymbolName(symbol, type)}`;

      const { acceptedMembers, rejectedMembers } = proposal;
      const acceptedOperations = _.map(acceptedMembers, (member) => ({ ...member, operation: 'Accept' }));
      const rejectedOperations = _.map(rejectedMembers, (member) => ({ ...member, operation: 'Reject' }));
      const operationSequence = this.generateOperationSequence(acceptedOperations, rejectedOperations);
      const lastOperation = operationSequence[operationSequence.length - 1];
      operationSequence.push({
        operation: 'Proposal Created', name: lastOperation.name, timestamp: lastOperation.timestamp,
      });
      const isOperatedUser = !!_.find(operationSequence, { username });

      const assetValue = common.getCoinValue(amount, symbol, type, currency, prices);

      this.setState({
        dateTimeText, to, from, memo, amountText, assetValue, feesText, status, isOperatedUser, operationSequence,
      });
    }

    calcDateTime = (dateTime) => {
      let dateTimeText = '';
      if (dateTime) {
        const daysElapsed = moment().diff(dateTime, 'days');
        if (daysElapsed < 1) {
          dateTimeText = dateTime.fromNow();
        } else {
          dateTimeText = dateTime.format('LL');
        }
      }
      return dateTimeText;
    }

    accept = async () => {
      const { navigation } = this.props;
      const { rawTransaction, objectId } = this.proposal;
      try {
        this.setState({ isLoading: true });
        const transaction = createTransaction(this.token, null, null, {});
        transaction.rawTransaction = rawTransaction;
        transaction.proposalId = objectId;
        await transaction.signTransaction();
        const proposal = await transaction.processSignedTransaction();
        this.updateProposal(proposal);
        if (transaction.txHash) {
          const completedParams = { coin: this.token, hash: transaction.txHash };
          navigation.navigate('TransferCompleted', completedParams);
        } else {
          navigation.navigate('CreateProposalSuccess');
        }
      } catch (error) {
        console.log('accept, error: ', error);
        this.addErrorNotification(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    onAcceptPressed = () => {
      const { callAuthVerify } = this.props;
      callAuthVerify(this.accept, () => null);
    }

    reject = async () => {
      const { navigation, addConfirmation } = this.props;
      const confirmation = createInfoConfirmation(
        strings('modal.rejectProposal.title'),
        strings('modal.rejectProposal.body'),
        async () => {
          try {
            this.setState({ isLoading: true });
            const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.rejectMultisigTransaction(this.proposal.objectId), this);
            this.updateProposal(proposal);
            navigation.goBack();
          } catch (error) {
            console.log('reject, error: ', error);
            this.addErrorNotification(error);
          } finally {
            this.setState({ isLoading: false });
          }
        },
        () => null,
      );
      addConfirmation(confirmation);
    }

    delete = () => {
      const { navigation, addConfirmation } = this.props;
      const confirmation = createInfoConfirmation(
        strings('modal.deleteProposal.title'),
        strings('modal.deleteProposal.body'),
        async () => {
          try {
            this.setState({ isLoading: true });
            const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.deleteMultiSigProposal(this.proposal.objectId), this);
            this.updateProposal(proposal);
            navigation.goBack();
          } catch (error) {
            console.warn('delete, error: ', error);
            this.addErrorNotification(error);
          } finally {
            this.setState({ isLoading: false });
          }
        },
        () => null,
      );
      addConfirmation(confirmation);
    }

    updateProposal = (proposal) => {
      const { token } = this;
      if (token.proposal && token.proposal.objectId === proposal.objectId) {
        const { updateProposal } = this.props;
        updateProposal(proposal);
      }
    }

    onToPress = () => {
      const { addNotification } = this.props;
      const { to } = this.state;
      Clipboard.setString(to);
      const notification = createInfoNotification(
        'modal.addressCopied.title',
        'modal.addressCopied.body',
      );
      addNotification(notification);
    }

    onFromPress = () => {
      const { addNotification } = this.props;
      const { from } = this.state;
      Clipboard.setString(from);
      const notification = createInfoNotification(
        'modal.addressCopied.title',
        'modal.addressCopied.body',
      );
      addNotification(notification);
    }

    addErrorNotification = (error) => {
      const { addNotification } = this.props;
      const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification();
      addNotification(notification);
    }

    render() {
      const { navigation, currency } = this.props;
      const {
        dateTimeText, to, from, memo, amountText, assetValue, feesText, isLoading, status, isOperatedUser, operationSequence,
      } = this.state;

      const customButton = isOperatedUser || status !== PROPOSAL_STATUS.PENDING ? null : (
        <Button text="button.accept" onPress={this.onAcceptPressed} />
      );

      let statusView = null;
      switch (status) {
        case PROPOSAL_STATUS.DELETED: {
          statusView = (<Text style={styles.deletedNotice}>{strings('page.wallet.proposal.paymentRemoved')}</Text>);
          break;
        }
        case PROPOSAL_STATUS.FAILED: {
          statusView = (<Text style={styles.deletedNotice}>{strings('page.wallet.proposal.paymentFailed')}</Text>);
          break;
        }
        case PROPOSAL_STATUS.REJECTED: {
          statusView = (<Text style={styles.deletedNotice}>{strings('page.wallet.proposal.paymentRejected')}</Text>);
          break;
        }
        case PROPOSAL_STATUS.SENT: {
          statusView = (<Text style={styles.deletedNotice}>{strings('page.wallet.proposal.paymentSent')}</Text>);
          break;
        }
        default:
          statusView = isOperatedUser
            ? null
            : (
              <TouchableOpacity
                style={[styles.deleteView]}
                onPress={this.reject}
              >
                <Text style={styles.delete}>{strings('page.wallet.proposal.reject')}</Text>
              </TouchableOpacity>
            );
      }

      const assetValueText = common.getAssetValueString(assetValue);
      const currencySymbol = common.getCurrencySymbol(currency);

      return (
        <BasePageGereral
          isSafeView
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.proposal.title" />}
          customBottomButton={customButton}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <View>
                <ResponsiveText layoutStyle={txStyles.amount} fontStyle={styles.amountText} maxFontSize={40}>{amountText}</ResponsiveText>
                <Text style={styles.assetValue}>{`${currencySymbol}${assetValueText}`}</Text>
              </View>
            </View>
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.proposal.minerFee')}</Text>
              <Text>{feesText}</Text>
            </View>
            { statusView }
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.transaction.date')}</Text>
              <Text>{dateTimeText}</Text>
            </View>
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.transaction.to')}</Text>
              <TouchableOpacity style={[styles.copyView]} onPress={this.onToPress}>
                <Text style={[styles.copyText]}>{to}</Text>
                <Image style={styles.copyIcon} source={references.images.copyIcon} />
              </TouchableOpacity>
            </View>
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.transaction.from')}</Text>
              <TouchableOpacity style={[styles.copyView]} onPress={this.onFromPress}>
                <Text style={[styles.copyText]}>{from}</Text>
                <Image style={styles.copyIcon} source={references.images.copyIcon} />
              </TouchableOpacity>
            </View>
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.transaction.memo')}</Text>
              <Text>{memo}</Text>
            </View>
            <View style={txStyles.sectionContainer}>
              <Text style={[txStyles.sectionTitle]}>{strings('page.wallet.proposal.timeline')}</Text>
              <FlatList
                style={space.marginTop_5}
                data={operationSequence}
                renderItem={({ item, index }) => (
                  <View style={styles.operationRow}>
                    <View style={styles.numberView}>
                      <Text style={styles.number}>{ operationSequence.length - index }</Text>
                    </View>
                    <View style={styles.operationColumn}>
                      <Text style={[styles.operationText, item.operation === 'Reject' ? styles.reject : null]}>{ item.operation }</Text>
                      <Text>{ item.name }</Text>
                    </View>
                    <Text>{ this.calcDateTime(moment(item.timestamp)) }</Text>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            { status === PROPOSAL_STATUS.PENDING && (
              <View style={txStyles.sectionContainer}>
                <TouchableOpacity style={[styles.deleteView]} onPress={this.delete}>
                  <Text style={styles.delete}>{strings('page.wallet.proposal.delete')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BasePageGereral>
      );
    }
}

MultisigProposalDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
    findToken: PropTypes.func,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  addConfirmation: PropTypes.func.isRequired,
  updateProposal: PropTypes.func.isRequired,
  callAuthVerify: PropTypes.func.isRequired,
  updateTimestamp: PropTypes.number.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  prices: state.Price.get('prices'),
  currency: state.App.get('currency'),
});

const mapDispatchToProps = (dispatch) => ({
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  callAuthVerify: (callback, fallback) => dispatch(appActions.callAuthVerify(callback, fallback)),
  setMultisigBTCAddress: (invitationCode, address) => dispatch(walletActions.setMultisigBTCAddress(invitationCode, address)),
  updateProposal: (proposal) => dispatch(walletActions.updateProposal(proposal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigProposalDetail);
