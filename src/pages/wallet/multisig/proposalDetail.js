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
import ResponsiveText from '../../../components/common/misc/responsive.text';
import common from '../../../common/common';

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
        isCreator: false,
        dateTimeText: null,
        to: null,
        from: null,
        amountText: null,
        feesText: null,
      };
    }

    componentDidMount() {
      this.processProposal();
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
    }

    processProposal = async () => {
      const { proposal } = this;
      const {
        creator, type, createdAt, rawTransaction,
      } = proposal;
      const user = await parseHelper.getUser();
      const username = user.get('username');
      const symbol = 'BTC';

      let isCreator = false;
      if (creator === username) {
        isCreator = true;
      }
      const dateTimeText = moment(createdAt).format('LLL');
      const from = rawTransaction.tx.addresses[0];
      const to = rawTransaction.tx.addresses[1];
      const feesValue = rawTransaction.tx.fees;

      const amountValue = rawTransaction.tx.outputs[0].value;
      const amount = common.convertUnitToCoinAmount(symbol, amountValue);
      const amountText = `${common.getBalanceString(amount, symbol)} ${common.getSymbolName(symbol, type)}`;

      const fees = common.convertUnitToCoinAmount(symbol, feesValue);
      const feesText = `${common.getBalanceString(fees, symbol)} ${common.getSymbolName(symbol, type)}`;

      this.setState({
        isCreator, dateTimeText, to, from, amountText, feesText,
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
      const { rawTransaction, id } = this.proposal;
      try {
        const transaction = new Transaction(this.token, null, null, {});
        transaction.rawTransaction = rawTransaction;
        transaction.proposalId = id;
        await transaction.signTransaction();
        await transaction.processSignedTransaction();
      } catch (error) {
        console.log('accept, error: ', error);
      }
    }

    reject = async () => {
      try {
        const result = await CancelablePromiseUtil.makeCancelable(parseHelper.rejectMultisigTransaction(this.proposal.id), this);
        console.log('reject, result: ', result);
      } catch (error) {
        console.log('reject, error: ', error);
      }
    }

    delete = async () => {
      try {
        const result = await CancelablePromiseUtil.makeCancelable(parseHelper.deleteMultiSigProposal(this.proposal.id), this);
        console.log('reject, result: ', result);
      } catch (error) {
        console.log('reject, error: ', error);
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
        isCreator, dateTimeText, to, from, amountText, feesText,
      } = this.state;

      const customButton = isCreator ? null : (
        <Button text="button.accept" onPress={this.accept} />
      );

      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.proposal.title" />}
          customBottomButton={customButton}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.amountView}>
              <ResponsiveText layoutStyle={styles.amount} fontStyle={styles.amountText} maxFontSize={40}>{amountText}</ResponsiveText>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle]}>Miner fee</Text>
            <Text>{feesText}</Text>
          </View>
          {
            !isCreator && (<TouchableOpacity onPress={this.reject}><Text>Reject Payment Proposal</Text></TouchableOpacity>)
          }
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
          {
            isCreator && (
              <View style={styles.sectionContainer}>
                <TouchableOpacity style={[styles.deleteView]} onPress={this.delete}>
                  <Text style={styles.delete}>Delete Payment Proposal</Text>
                </TouchableOpacity>
              </View>
            )
          }
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
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  setMultisigBTCAddress: (invitationCode, address) => dispatch(walletActions.setMultisigBTCAddress(invitationCode, address)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigProposalDetail);
