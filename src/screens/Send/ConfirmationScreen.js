import React, { Component } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import {
  Content,
  Container,
  Text,
  View,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Application from 'mellowallet/lib/Application';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import BorderView from 'mellowallet/src/components/BorderView';
import Loader from 'mellowallet/src/components/Loader';
import SummaryRow from 'mellowallet/src/components/SummaryRow';

import { setWalletToSend } from 'mellowallet/src/store/actions/wallet';
import { round, printError } from 'mellowallet/src/utils';

import { t } from 'mellowallet/src/i18n';
import CustomModal from 'mellowallet/src/components/CustomModal';
import { conf } from '../../utils/constants';

const styles = StyleSheet.create({
  addressText: {
    color: '#8E8E93',
    marginTop: 10,
    textAlign: 'center',
  },
  boldtext: {
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});

const mapDispatchToProps = dispatch => ({
  setWalletToSend: () => dispatch(setWalletToSend()),
});

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResultModal: false,
      txHash: '',
      error: false,
      errorMessage: '',
      isLoading: false,
    };
    const { navigation } = this.props;
    this.estimation = navigation.getParam('estimation');
    this.toAddress = navigation.getParam('toAddress');
    this.rensName = navigation.getParam('rensName');
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  onConfirmPress = async () => {
    await this.setState({ isLoading: true });
    this.estimation.confirm()
      .then((txResult) => {
        this.setState({
          txHash: txResult.tx_hash,
          showResultModal: true,
          error: false,
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({
          showResultModal: true,
          error: true,
          errorMessage: e.error_message,
          isLoading: false,
        });
      });
  };

  onFinishTransfer = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
    this.props.setWalletToSend(null);
  };

  openHashOnBrowser = () => {
    const { navigation } = this.props;
    const network = navigation.getParam('network');

    Application(app => app.get_network(network)
      .then((cryptoNetwork) => {
        const url = cryptoNetwork.get_tx_explorer_url(this.state.txHash);
        Linking.openURL(url);
      })
      .catch(e => printError(e)));
  };

  render() {
    const { error, errorMessage } = this.state;
    const {
      amount,
      fees,
      total,
    } = this.estimation;
    return (
      <Container>
        <ActionHeader
          title={t('Confirm')}
          backAction={this.goBack}
        />

        <CustomModal
          title={error ? t('Transaction Error') : t('Transaction Succesful')}
          description={error ? errorMessage : t('The funds have been debited from your wallet.')}
          visible={this.state.showResultModal}
          iconName={error ? 'priority-high' : 'check'}
          error={this.state.error}
          primaryButtonText={t('Ok')}
          onPressPrimaryButton={this.onFinishTransfer}
          secondaryButtonText={error ? undefined : t('View TX hash')}
          onPressSecondaryButton={this.openHashOnBrowser}
        />

        <Content padder>
          <Loader loading={this.state.isLoading}/>
          <SummaryRow
            title={t('Amount')}
            primaryValue={`${amount.fiat_unit} ${round(amount.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
            secondaryValue={`${amount.unit} ${amount.value}`}
          />
          <SummaryRow
            title={t('Est. Fees')}
            primaryValue={`${fees.fiat_unit} ${round(fees.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
            secondaryValue={`${fees.unit} ${fees.value}`}
          />
          <BorderView/>
          <SummaryRow
            title={t('Total')}
            primaryValue={`${total.fiat_unit} ${round(total.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
            secondaryValue={`${total.unit} ${total.value}`}
          />
          <BorderView/>
          <View>
            <Text style={[styles.addressText, styles.boldtext]}>
              {`${t('To Address')}:`}
            </Text>
            <Text
              style={styles.addressText}>{this.rensName ? (`${this.rensName} (${this.toAddress})`) : (this.toAddress)}</Text>
          </View>
          <Button
            style={styles.button}
            onPress={this.onConfirmPress}
          >
            <Text>{t('Confirm Transaction')}</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

Confirmation.propTypes = {
  setWalletToSend: PropTypes.func.isRequired,
};

const ConfirmationScreen = connect(null, mapDispatchToProps)(Confirmation);

export default ConfirmationScreen;
