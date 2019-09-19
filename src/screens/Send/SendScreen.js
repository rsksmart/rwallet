import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import {
  Button,
  Container,
  Content,
  Form,
  H2,
  Picker,
  Text,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';

import {
  paste,
  printError,
  round,
} from 'mellowallet/src/utils';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import QRScanner from 'mellowallet/src/components/QRScanner';
import RegularFieldTextInput
  from 'mellowallet/src/components/FormInputs/Fields/RegularFieldTextInput';
import FormRow from 'mellowallet/src/components/FormInputs/FormRow';
import Label from 'mellowallet/src/components/Label';
import FormPicker from 'mellowallet/src/components/FormInputs/FormPicker';
import Wallet from 'mellowallet/src/store/models';
import { t } from 'mellowallet/src/i18n';
import { number, required } from 'mellowallet/src/utils/validations';
import { setWalletToSend } from 'mellowallet/src/store/actions/wallet';
import Loader from 'mellowallet/src/components/Loader';
import Application from 'mellowallet/lib/Application';
import { conf } from '../../utils/constants';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    walletToSend: rootReducer.walletToSend,
    showQRScanner: rootReducer.showQRScanner,
  };
};

const mapDispatchToProps = dispatch => ({
  setWalletToSend: () => dispatch(setWalletToSend()),
  bindActionCreators: () => dispatch(change),
});

const priorityOptions = {
  0: {
    label: 'Low priority',
    value: 'low',
  },
  1: {
    label: 'Normal',
    value: 'normal',
  },
  2: {
    label: 'Priority',
    value: 'high',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inlineForm: {
    flexDirection: 'row',
  },
  currencySelect: {
    flex: 0.5,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 9,
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});

class Send extends Component {
  constructor(props) {
    super(props);
    this.currencyItems = [];
    this.priorityItems = Object.keys(priorityOptions)
      .map(key => (
        <Picker.Item
          key={priorityOptions[key].value}
          label={t(priorityOptions[key].label)}
          value={priorityOptions[key].value}
        />
      ));

    this.state = {
      openQRScanner: this.props.showQRScanner,
      to: '',
      amount: 0.00,
      currency: {},
      priority: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    Application(app => app.get_display_currency())
      .then((currency) => {
        const { network } = this.props.walletToSend;
        const currencies = [network, currency];
        this.currencyItems = currencies.map(value => (
          <Picker.Item
            key={value}
            label={value}
            value={value}
          />
        ));

        this.setState({
          currency,
          priority: 'normal',
        });
        this.props.change('priority', this.priorityItems[1]);
      })
      .catch((error) => {
        printError(error);
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  async onScanQRPress() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      this.setState({ openQRScanner: true });
    }
  }

  onPastePress = () => {
    paste()
      .then((value) => {
        this.props.change('toAddress', value);
        this.setState({ to: value });
      });
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  shouldComponentUpdate = (newProps) => {
    if (!newProps.walletToSend) {
      this.props.navigation.dispatch(NavigationActions.back());
      return false;
    }
    return true;
  };

  cleanWallet = () => {
    this.props.setWalletToSend(null);
  };

  onSendPress = async () => {
    const { valid } = this.props;
    if (!valid) {
      return;
    }

    await this.setState({ isLoading: true });
    const { network } = this.props.walletToSend;
    const { amount, currency } = this.state;

    if (currency === network) {
      this.send(amount);
    } else {
      Application(app => app.currency_conversion(amount, currency, network)
        .then(value => this.send(value))
        .catch((e) => {
          this.setState({ isLoading: false });
          printError(e);
        }));
    }
  };

  send = (amount) => {
    // Do we need to translate R/ENS name to address?

    const REnsName = this.state.to.toLowerCase(this.state.to.trim());
    if (REnsName.endsWith('.rsk') || REnsName.endsWith('.eth')) {
      const network = this.props.walletToSend.originalWallet.get_network_object();
      Application(app => app.resolve_name_from_addr(network, REnsName)
        .then((result) => {
          if (network.is_address_valid(result)) {
            if (result === '0x0000000000000000000000000000000000000000') {
              printError(t(`${REnsName} does not resolve to any known name in the network`));
              this.setState({ isLoading: false });
            } else {
              this.estimateAndNavToConfirm(result, amount, REnsName);
            }
          } else {
            printError(t('Error during name resolution request'));
            this.setState({ isLoading: false });
          }
        })
        .catch(e => printError(e)));
    } else {
      this.estimateAndNavToConfirm(this.state.to, amount);
    }
  };

  estimateAndNavToConfirm = (toAddress, amount, REnsName) => {
    const { originalWallet } = this.props.walletToSend;
    const { priority } = this.state;
    originalWallet.estimate_tx(toAddress, amount, priority)
      .then((estimation) => {
        this.navigateToConfirmScreen(estimation, toAddress, REnsName);
      })
      .catch((e) => {
        printError(e);
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  navigateToConfirmScreen = (estimation, toAddress, rensName) => {
    const { navigation, walletToSend } = this.props;
    navigation.navigate('Confirmation', {
      estimation,
      toAddress,
      rensName,
      network: walletToSend.network,
    });
  };

  componentWillUnmount = () => {
    this.cleanWallet();
  };

  handleCancelCodeScan = () => {
    this.setState({ openQRScanner: false });
  };

  handleBarCodeScanned = ({ data }) => {
    this.setState(() => {
      this.props.change('toAddress', data);
      return {
        openQRScanner: false,
        to: data,
      };
    });
  };

  onCurrencyChange = (currency) => {
    this.setState({ currency });
    this.props.change('amount', '');
  };

  onAmountChange = (amount) => {
    this.setState({ amount: amount.replace(',', '.') });
  };

  onAddressChange = (to) => {
    this.setState({ to });
  };

  onPriorityChange = (priority) => {
    this.setState({ priority });
  };

  // Custom validation function for the Address or Name input field.

  validAddressOrName = (value) => {
    const network = this.props.walletToSend.originalWallet.get_network_object();
    const normValue = value.trim();
    if (network.is_address_valid(normValue)) {
      return undefined;
    }

    return 'Must provide a valid address or name';
  };

  render() {
    const { valid, walletToSend } = this.props;
    const { name, network, balance } = walletToSend;

    if (this.state.openQRScanner) {
      return (
        <QRScanner
          handleBarCodeScanned={this.handleBarCodeScanned}
          handleCancelCodeScan={this.handleCancelCodeScan}
          hidden={!this.state.openQRScanner}
        />
      );
    }

    return (
      <Container>
        <ActionHeader
          title={`${t('Send from')} ${name} (${network})`}
          backAction={this.goBack}
        />
        <Content style={styles.container} padder>
          <Loader loading={this.state.isLoading}/>
          <H2>{t('To')}</H2>
          <Form>
            <FormRow>
              <RegularFieldTextInput
                name="toAddress"
                placeholder={`${t('{{network}} Address or Name', { network })}`}
                returnKeyType="done"
                onChangeText={this.onAddressChange}
                value={this.state.to}
                validations={[required, this.validAddressOrName]}
              />
              <Label style={styles.label}>{t('Destination wallet address or Name')}</Label>
              <View style={styles.inlineForm}>
                <Button
                  transparent
                  onPress={this.onPastePress}
                >
                  <Text>{t('Paste')}</Text>
                </Button>
                <Button
                  transparent
                  onPress={() => this.onScanQRPress()}
                >
                  <Text>{t('Scan QR')}</Text>
                </Button>
              </View>
            </FormRow>

            <View style={styles.inlineForm}>
              <FormRow style={styles.currencySelect}>
                <FormPicker
                  name="currency"
                  selectedValue={this.state.currency}
                  headerLabel={t('Select one currency')}
                  onValueChange={this.onCurrencyChange}
                >
                  {this.currencyItems}
                </FormPicker>
              </FormRow>
              <FormRow style={styles.amountInput}>
                <RegularFieldTextInput
                  name="amount"
                  placeholder="0.00"
                  returnKeyType="done"
                  onChangeText={this.onAmountChange}
                  value={this.state.amount}
                  keyboardType="numeric"
                  validations={[number]}
                />
                <Label style={styles.label}>
                  {`${t('You have {{value}} {{unit}} / {{fiat_unit}} {{fiat_value}}', {
                    value: balance.value,
                    unit: balance.unit,
                    fiat_unit: balance.fiat_unit,
                    fiat_value: round(balance.fiat_value, conf('FIAT_DECIMAL_PLACES'))
                  })}`}
                </Label>
              </FormRow>
            </View>

            <FormRow>
              <FormPicker
                name="priority"
                selectedValue={this.state.priority}
                onValueChange={this.onPriorityChange}
                headerLabel={t('Select one priority')}
                block
              >
                {this.priorityItems}
              </FormPicker>
              <Label style={styles.label}>
                {t('Priority based transaction fee')}
              </Label>
            </FormRow>

            <FormRow>
              <Button
                disabled={!valid}
                onPress={this.onSendPress}
                style={styles.button}
              >
                <Text>{t('Send')}</Text>
              </Button>
            </FormRow>
          </Form>
        </Content>
      </Container>
    );
  }
}

Send.propTypes = {
  setWalletToSend: PropTypes.func.isRequired,
  walletToSend: PropTypes.shape(Wallet),
  change: PropTypes.func.isRequired,
  valid: PropTypes.bool,
  showQRScanner: PropTypes.bool,
};

Send.defaultProps = {
  walletToSend: null,
  valid: false,
  showQRScanner: false,
};

const SendForm = reduxForm({
  form: 'SendForm',
})(Send);

const SendScreen = connect(mapStateToProps, mapDispatchToProps)(SendForm);

export default SendScreen;
