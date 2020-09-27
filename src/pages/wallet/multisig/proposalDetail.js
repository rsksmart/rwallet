import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text, TouchableOpacity, View, StyleSheet, Image, Clipboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Transaction from '../../../common/transaction';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import parseHelper from '../../../common/parse';
import color from '../../../assets/styles/color';
import { strings } from '../../../common/i18n';
import Button from '../../../components/common/button/button';
import references from '../../../assets/references';
import { createInfoNotification } from '../../../common/notification.controller';
import { createInfoConfirmation } from '../../../common/confirmation.controller';
import ResponsiveText from '../../../components/common/misc/responsive.text';
import common from '../../../common/common';
import { PROPOSAL_STATUS } from '../../../common/constants';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 20,
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
  state: {
    fontSize: 17,
    fontWeight: '600',
  },
  memo: {
    fontSize: 13,
    fontWeight: '300',
  },
  link: {
    color: color.app.theme,
    fontSize: 17,
    alignSelf: 'center',
  },
  linkView: {
    marginTop: 20,
    marginBottom: 40,
  },
  amount: {
    flex: 1,
    marginRight: 75,
  },
  amountText: {
    color: color.black,
    fontWeight: '400',
  },
  amountView: {
    flexDirection: 'row',
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
      const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchProposal(objectId), this);
      this.proposal = proposal;
      this.processProposal();
      this.updateProposal(proposal);
    }

    processProposal = async () => {
      const { proposal } = this;
      const {
        type, createdAt, rawTransaction, status,
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
      const isAcceptedUser = !!_.find(acceptedMembers, { userId: username });
      const isRejectedUser = !!_.find(rejectedMembers, { userId: username });
      const isOperatedUser = isAcceptedUser || isRejectedUser;

      this.setState({
        dateTimeText, to, from, amountText, feesText, status, isOperatedUser,
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
      const { symbol, type } = this.token;
      try {
        this.setState({ isLoading: true });
        const transaction = new Transaction(this.token, null, null, {});
        transaction.rawTransaction = rawTransaction;
        transaction.proposalId = objectId;
        await transaction.signTransaction();
        const proposal = await transaction.processSignedTransaction();
        this.updateProposal(proposal);
        if (transaction.txHash) {
          const completedParams = { symbol, type, hash: transaction.txHash };
          navigation.navigate('TransferCompleted', completedParams);
        } else {
          navigation.navigate('CreateProposalSuccess');
        }
      } catch (error) {
        console.log('accept, error: ', error);
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
            console.log('this.proposal: ', this.proposal);
            this.setState({ isLoading: true });
            const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.rejectMultisigTransaction(this.proposal.objectId), this);
            this.updateProposal(proposal);
            console.log('reject, result: ', proposal);
            navigation.goBack();
          } catch (error) {
            console.log('reject, error: ', error);
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
            console.log('this.proposal: ', this.proposal);
            this.setState({ isLoading: true });
            const proposal = await CancelablePromiseUtil.makeCancelable(parseHelper.deleteMultiSigProposal(this.proposal.objectId), this);
            this.updateProposal(proposal);
            console.log('delete, result: ', proposal);
            navigation.goBack();
          } catch (error) {
            console.log('delete, error: ', error);
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
      console.log('updateProposal, proposal: ', proposal);
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

    render() {
      const { navigation } = this.props;
      const {
        dateTimeText, to, from, amountText, feesText, isLoading, status, isOperatedUser,
      } = this.state;

      const customButton = isOperatedUser || status !== PROPOSAL_STATUS.PENDING ? null : (
        <Button text="button.accept" onPress={this.onAcceptPressed} />
      );

      let statusView = null;
      switch (status) {
        case PROPOSAL_STATUS.DELETED: {
          statusView = (<Text style={styles.deletedNotice}>The payment was removed.</Text>);
          break;
        }
        case PROPOSAL_STATUS.FAILED: {
          statusView = (<Text style={styles.deletedNotice}>The payment was failed.</Text>);
          break;
        }
        case PROPOSAL_STATUS.REJECTED: {
          statusView = (<Text style={styles.deletedNotice}>Payment Rejected.</Text>);
          break;
        }
        default:
          statusView = isOperatedUser ? null : (<TouchableOpacity style={[styles.deleteView]} onPress={this.reject}><Text style={styles.delete}>{strings('page.wallet.proposal.reject')}</Text></TouchableOpacity>);
      }

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
              <View style={styles.amountView}>
                <ResponsiveText layoutStyle={styles.amount} fontStyle={styles.amountText} maxFontSize={40}>{amountText}</ResponsiveText>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle]}>{strings('page.wallet.proposal.minerFee')}</Text>
              <Text>{feesText}</Text>
            </View>
            { statusView }
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle]}>{strings('page.wallet.transaction.date')}</Text>
              <Text>{dateTimeText}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle]}>{strings('page.wallet.transaction.to')}</Text>
              <TouchableOpacity style={[styles.copyView]} onPress={this.onToPress}>
                <Text style={[styles.copyText]}>{to}</Text>
                <Image style={styles.copyIcon} source={references.images.copyIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle]}>{strings('page.wallet.transaction.from')}</Text>
              <TouchableOpacity style={[styles.copyView]} onPress={this.onFromPress}>
                <Text style={[styles.copyText]}>{from}</Text>
                <Image style={styles.copyIcon} source={references.images.copyIcon} />
              </TouchableOpacity>
            </View>
            { status === PROPOSAL_STATUS.PENDING && (
              <View style={styles.sectionContainer}>
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
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

const mapDispatchToProps = (dispatch) => ({
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  callAuthVerify: (callback, fallback) => dispatch(appActions.callAuthVerify(callback, fallback)),
  setMultisigBTCAddress: (invitationCode, address) => dispatch(walletActions.setMultisigBTCAddress(invitationCode, address)),
  updateProposal: (proposal) => dispatch(walletActions.updateProposal(proposal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigProposalDetail);
