import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Content,
  Container,
  Text,
  View,
} from 'native-base';
import { connect } from 'react-redux';
import { setWalletToSend } from 'mellowallet/src/store/actions/wallet';
import { PropTypes } from 'prop-types';
import Wallet from 'mellowallet/src/store/models';
import { round } from 'mellowallet/src/utils';
import CurrencySymbol from 'mellowallet/src/components/CurrencySymbol';
import Title from 'mellowallet/src/components/Title';

import { t } from 'mellowallet/src/i18n';
import WalletHistoryList from './WalletHistoryList';
import { conf } from '../../../../../../utils/constants';

const mapDispatchToProps = dispatch => ({
  setWalletToSend: wallet => dispatch(setWalletToSend(wallet)),
});

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 0.5,
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
  },
  buttonLeft: {
    marginRight: 5,
  },
  buttonRight: {
    marginLeft: 5,
  },
  buttonText: {
    textAlign: 'center',
  },
  walletDetailsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  currencySymbol: {
    width: 50,
    height: 50,
  },
  criptoValue: {
    marginTop: 10,
    textAlign: 'center',
  },
  unitValue: {
    marginTop: 10,
    textAlign: 'center',
  },
});


class BalanceScreenComponent extends Component {
  onSendPress = () => {
    this.props.setWalletToSend(this.props.wallet);
  }

  render() {
    const { onReceivePressed, wallet } = this.props;
    const {
      value,
      unit,
      fiat_value,
      fiat_unit,
    } = wallet.balance;

    const network = this.props.networks[wallet.network];

    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <View style={styles.walletDetailsContainer}>
              <CurrencySymbol symbol={network.symbol} style={styles.currencySymbol} image={network.image} />
              <Title
                title={`${fiat_unit} ${round(fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
                subtitle={`${unit} ${value}`}
                titleStyle={[styles.unitValue]}
                subtitleStyle={[styles.criptoValue]}
              />
            </View>

            <View style={styles.actionsSection}>
              <Button style={[styles.button, styles.buttonLeft]} onPress={this.onSendPress}>
                <Text style={styles.buttonText}>{t('Send')}</Text>
              </Button>
              <Button style={[styles.button, styles.buttonRight]} onPress={onReceivePressed}>
                <Text style={styles.buttonText}>{t('Receive')}</Text>
              </Button>
            </View>
          </View>

          <View>
            <WalletHistoryList wallet={wallet} />
          </View>
        </Content>

      </Container>
    );
  }
}

BalanceScreenComponent.propTypes = {
  wallet: PropTypes.shape(Wallet).isRequired,
  onReceivePressed: PropTypes.func.isRequired,
  setWalletToSend: PropTypes.func.isRequired,
  networks: PropTypes.shape({}).isRequired,
};

const BalanceScreen = connect(mapStateToProps, mapDispatchToProps)(BalanceScreenComponent);

export default BalanceScreen;
