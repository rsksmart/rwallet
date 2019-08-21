import React from 'react';
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  Button,
  Container,
  Content,
  Text,
  ListItem,
  CheckBox,
} from 'native-base';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { t } from 'mellowallet/src/i18n';
import Application from 'mellowallet/lib/Application';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import CurrencySymbol from 'mellowallet/src/components/CurrencySymbol';
import Loader from 'mellowallet/src/components/Loader';

import { onStepCompleted } from 'mellowallet/src/store/actions/onBoarding';
import { printError } from 'mellowallet/src/utils';
import onBoardingStepEnum from 'mellowallet/src/utils/onBoardingStepEnum';

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: 200,
  },
  currencySymbol: {
    width: 45,
    height: 45,
    marginRight: 5,
  },
  checkBox: {
    marginRight: 30,
  },
  displayName: {
    fontWeight: 'bold',
  },
});

const mapDispatchToProps = dispatch => ({
  onStepCompleted: () => dispatch(onStepCompleted(onBoardingStepEnum.CREATED_WALLET)),
});

class SelectAssetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networks: [],
      isLoading: false,
      selectedNetworks: [],
    };
  }

  componentDidMount() {
    this.loadNetworks();
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  }

  keyExtractor = network => network.type;

  onNetworkPress = (network) => {
    this.setState(prevState => ({
      selectedNetworks: prevState.selectedNetworks.includes(network)
        ? prevState.selectedNetworks.filter(item => item !== network)
        : prevState.selectedNetworks.concat(network),
    }));
  }

  renderNetworkItem = ({ item }) => {
    const {
      display_name,
      symbol,
      image,
    } = item;
    const isSelected = this.state.selectedNetworks.includes(item);
    return (
      <ListItem
        onPress={() => this.onNetworkPress(item)}
        noBorder
      >
        <CheckBox
          checked={isSelected}
          onPress={() => this.onNetworkPress(item)}
          style={styles.checkBox}
        />
        <CurrencySymbol
          symbol={symbol}
          style={styles.currencySymbol}
          image={image}
        />
        <Text>
          {`${display_name} (${symbol})`}
        </Text>
      </ListItem>
    );
  }

  onCreateWalletsPress = async () => {
    const { selectedNetworks } = this.state;
    const promises = [];
    this.setState({ isLoading: true });
    try{
        for (var i = 0; i < selectedNetworks.length; i++){
            var wallet = await this.createWallet(selectedNetworks[i]);
            if (i == 0){
                AsyncStorage.setItem(
                    AsyncStorageEnum.FAVOURITE_WALLET,
                    JSON.stringify(wallet.id),
                );
            }
        }
        this.props.onStepCompleted();
    }catch (e){
        printError(e);
    }
    this.setState({ isLoading: false });
  }

  createWallet = (network) => {
    const { type, name } = network;
    return Application(app => app.create_wallet(`${name} ${t('Wallet')}`, type));
  }

  loadNetworks() {
    Application(app => app.get_networks())
      .then((networks) => {
        this.setState({
          networks,
        });
      }).catch(e => printError(e))
      .finally(() => this.setState({ isLoading: false }));
  }

  render() {
    const {
      selectedNetworks,
      networks,
      isLoading,
    } = this.state;
    const disableButton = selectedNetworks.length === 0;
    return (
      <Container>
        <ActionHeader
          title={t('Select your Assets')}
          backAction={this.goBack}
        />
        <Content padder>
          <Loader loading={isLoading} />
          <Text>{t('Please, select the coins you want to add to your new wallet')}</Text>
          <FlatList
            data={networks}
            extraData={selectedNetworks}
            renderItem={this.renderNetworkItem}
            keyExtractor={this.keyExtractor}
          />

          <Button
            disabled={disableButton}
            onPress={this.onCreateWalletsPress}
            style={styles.button}
          >
            <Text>{t('Ready To Go!')}</Text>
          </Button>
        </Content>

      </Container>
    );
  }
}

SelectAssetScreen.propTypes = {
  onStepCompleted: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SelectAssetScreen);
