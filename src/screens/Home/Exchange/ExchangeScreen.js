import React from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {
  Content,
  Container,
  Button,
  Icon,
  Item,
  Input,
  Label,
  Text,
} from 'native-base';
import material from 'mellowallet/native-base-theme/variables/material';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { printError } from 'mellowallet/src/utils';
import Wallet from 'mellowallet/src/store/models';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import WarningCard from 'mellowallet/src/components/WarningCard';
import WalletGridItem from 'mellowallet/src/components/Wallet/WalletGridItem';
import WalletsSearchBox from 'mellowallet/src/components/Wallet/WalletsSearchBox';
import Application from 'mellowallet/lib/Application';
import NavigationService from 'mellowallet/src/services/NavigationService';
import { t } from 'mellowallet/src/i18n';

const emptyWalletFrom = {
  network: 'BTC',
  balance: {
    value: '0.00',
  },
};

const emptyWalletTo = {
  network: 'ETH',
  balance: {
    value: '0.00',
  },
};

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
    wallets: rootReducer.wallets,
  };
};

const styles = StyleSheet.create({
  walletsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  WalletsSectionItem: {
    width: '45%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },
  roundedButton: {
    borderRadius: 50,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  roundedButtonIcon: {
    fontSize: 24,
    marginLeft: 0,
    marginRight: 0,
  },
  verticalLine: {
    width: 1,
    height: 30,
    backgroundColor: material.brandPrimary,
  },
  verticalMiddleLine: {
    height: 42,
  },
  verticalBottomLine: {
    height: 45,
  },
  conversionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '10%',
  },
  conversionLabel: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: material.brandPrimary,
    borderRadius: 50,
  },
  conversionSection: {
    margin: 5,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  conversionText: {
    color: '#FFF',
  },
  formContainer: {
    padding: 20,
  },
  formInput: {
    marginTop: 30,
    marginBottom: 30,
  },
});

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletFrom: props.wallets[0] || emptyWalletFrom,
      walletTo: props.wallets[1] || emptyWalletTo,
      conversion: 0,
      emptyState: !(props.wallets[0] && props.wallets[1]),
      showSearchBox: false,
      searchingWallet: '',
      valid: false,
    };
  }

  componentDidMount() {
    this.setConversionRate();
  }

  setConversionRate = async () => {
    const { walletFrom, walletTo } = this.state;
    try {
      const conversion = await Application(app => app.currency_conversion(
        1,
        walletFrom.network,
        walletTo.network,
      ));
      this.setState({ conversion });
    } catch (e) {
      printError(e);
    }
  }

  switchWallets = () => {
    const { walletFrom, walletTo } = this.state;
    this.setState({
      walletFrom: walletTo,
      walletTo: walletFrom,
    }, this.setConversionRate);
  }

  shouldComponentUpdate = (nextProps, currentState) => {
    if (currentState.emptyState && nextProps.wallets && nextProps.wallets.length > 1) {
      const walletFrom = nextProps.wallets.shift();
      const walletTo = nextProps.wallets.filter(wallet => wallet.network !== walletFrom.network)[0];
      if (walletTo) {
        this.setState({
          walletFrom,
          walletTo,
          emptyState: false,
        }, this.setConversionRate);
      }
    }
    return true;
  }

  renderEmptyListComponent = () => (
    <WarningCard
      color="#17EAD9"
      iconName="error-outline"
      message={t("You'll need to have at least two wallets holding different currencies to proceed with the exchange")}
    />
  );

  openSearchBox = (walletKey) => {
    this.setState({
      showSearchBox: true,
      searchingWallet: walletKey,
    });
  }

  closeSearchBox = () => {
    this.setState({
      showSearchBox: false,
    });
  }

  onWalletSelected = (wallet) => {
    this.setState(prevState => (
      {
        [prevState.searchingWallet]: wallet,
        showSearchBox: false,
      }
    ));
  }

  onExchange = async () => {
    const { walletFrom, walletTo } = this.state;
    try {
      const exchanges = await Application(app => app.get_exchanges());
      const exchangeModel = exchanges.filter(exchange => exchange.get_model() === 1);
      const changelly = await exchangeModel.shift().estimate_exchange(
        walletFrom.originalWallet,
        walletTo.originalWallet,
        this.inputRef._getText(),
      );
      NavigationService.navigate('ConfirmationExchange', {
        changelly,
        networkFrom: this.props.networks[walletFrom.network],
        networkTo: this.props.networks[walletFrom.network],
      });
    } catch (e) {
      printError(e, 'danger');
    }
  }

  setInputRef = (ref) => {
    this.inputRef = ref._root;
  }

  validateAmount = (value) => {
    const numericValue = parseFloat(value);
    this.setState(prevState => (
      {
        ...prevState,
        valid: (typeof numericValue === 'number' && numericValue < prevState.walletFrom.balance.value && numericValue > 0),
      }
    ));
  }

  renderExchangeForm = () => (
    <View style={styles.formContainer}>
      <Item floatingLabel style={styles.formInput}>
        <Label>{t('Amount to exchange')}</Label>
        <Input
          getRef={this.setInputRef}
          returnKeyLabel={t('Done')}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          keyboardType="numeric"
          onChangeText={this.validateAmount}
        />
      </Item>
      <Button block onPress={() => this.onExchange()} disabled={!this.state.valid}><Text>{t('Exchange')}</Text></Button>
    </View>
  )

  render() {
    const { walletFrom, walletTo } = this.state;
    return (
      <Container>

        <ActionHeader
          title={t('Exchange')}
        />

        <Content>
          <View style={styles.walletsSection}>
            <View style={styles.WalletsSectionItem}>
              <WalletGridItem
                wallet={walletFrom}
                emptyState={this.state.emptyState}
                onPress={() => this.openSearchBox('walletFrom')}
              />
            </View>

            <View style={styles.conversionButtons}>

              <Button style={styles.roundedButton} bordered>
                <Icon name="arrow-forward" style={styles.roundedButtonIcon} />
              </Button>

              <View style={styles.verticalLine} />

              <WalletsSearchBox
                visible={this.state.showSearchBox}
                wallets={this.props.wallets}
                onSelect={this.onWalletSelected}
                onClose={this.closeSearchBox}
                onRequestClose={this.closeSearchBox}
              />

              {!this.state.emptyState ? (
                <Button style={styles.roundedButton} onPress={this.switchWallets}>
                  <Icon name="swap-horiz" style={styles.roundedButtonIcon} />
                </Button>
              ) : <View style={[styles.verticalLine, styles.verticalMiddleLine]} />
              }

              <View style={[styles.verticalLine, styles.verticalBottomLine]} />

            </View>

            <View style={styles.WalletsSectionItem}>
              <WalletGridItem
                wallet={walletTo}
                emptyState={this.state.emptyState}
                onPress={() => this.openSearchBox('walletTo')}
              />
            </View>

          </View>

          <View style={styles.conversionSection}>
            <View style={styles.conversionLabel}>
              <Text
                adjustsFontSizeToFit
                style={styles.conversionText}
              >
                {`1 ${walletFrom.network} = ${this.state.conversion.toString()} ${walletTo.network}`}
              </Text>
            </View>
          </View>

          {this.state.emptyState ? this.renderEmptyListComponent() : this.renderExchangeForm()}
        </Content>
      </Container>
    );
  }
}

Exchange.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)),
  networks: PropTypes.shape({}).isRequired,
};

Exchange.defaultProps = {
  wallets: [],
};

const ExchangeScreen = connect(mapStateToProps)(Exchange);

export default ExchangeScreen;
