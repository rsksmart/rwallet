import React, { Component } from 'react';
import { AsyncStorage, BackHandler, Alert } from 'react-native';
import {
  Container,
} from 'native-base';
import Application from 'mellowallet/lib/Application';
import ActionHeader from 'mellowallet/src/components/ActionHeader';

import { PropTypes } from 'prop-types';

import { t } from 'mellowallet/src/i18n';
import { printError } from 'mellowallet/src/utils';
import { connect } from 'react-redux';
import { refreshWalletsList, setFavouriteWallet, setNetworks } from 'mellowallet/src/store/actions/wallet';
import NavigationService from 'mellowallet/src/services/NavigationService';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';

import Wallet from 'mellowallet/src/store/models';

import WalletList from './WalletList';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    wallets: rootReducer.wallets,
    favouriteWallet: rootReducer.favouriteWallet,
    walletsListDirty: rootReducer.walletsListDirty,
    walletToEdit: rootReducer.walletToEdit,
    walletToSend: rootReducer.walletToSend,
  };
};

const mapDispatchToProps = dispatch => ({
  refreshWalletsList: wallets => dispatch(refreshWalletsList(wallets)),
  setFavouriteWallet: wallet => dispatch(setFavouriteWallet(wallet)),
  setNetworks: networks => dispatch(setNetworks(networks)),
});

class Wallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.loadNetworks();
    this.getWallets();
    this.loadFavouriteWallet();
    const willBlurSubscription = this.props.navigation.addListener('willBlur', () => {BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)});
    const willFocusSubscription = this.props.navigation.addListener('willFocus', () => {BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)});
  }

  handleBackButton = () => {
    Alert.alert(
        'Exit App',
        'Exiting the application?', [{
            text: 'Cancel',
            // onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
        }, {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
        }, ], {
            cancelable: false
        }
     )
     return true;
  }
  
  componentWillReceiveProps(props) {
    const {
      walletsListDirty,
      walletToEdit,
      walletToSend,
    } = props;
    if (walletsListDirty) {
      // TODO: timeout is just to mock a async call
      setTimeout(() => this.getWallets(), 1000);
    }

    if (walletToEdit) {
      this.navigateToNewWalletScreen();
    }

    if (walletToSend) {
      this.navigateToSendScreen();
    }
  }

  loadNetworks = () => {
    Application(app => app.get_networks())
      .then((networks) => {
        this.props.setNetworks(networks);
      }).catch(e => printError(e));
  }

  getWallets = () => {
    Application(app => app.get_wallets())
      .then((wallets) => {
        const localWallets = wallets.map(async wallet => new Wallet(wallet));
        this.default = wallets[0];
        Promise.all(localWallets)
          .then(result => this.props.refreshWalletsList(result))
          .catch(e => printError(e));
      })
      .catch(e => printError(e));
  }

  loadFavouriteWallet = () => {
    AsyncStorage.getItem(AsyncStorageEnum.FAVOURITE_WALLET)
      .then((wallet) => {
        const walletId = wallet && wallet.id ? wallet.id : wallet;
        if (walletId) {
          this.loadOriginalWallet(walletId);
          return;
        }
        this.setWalletDefaultFavouriteWallet();
      }).catch(e => printError(e));
  }

  setWalletDefaultFavouriteWallet = () => {
    if (this.default) {
      this.props.setFavouriteWallet(this.default);
    }
  }

  loadOriginalWallet = async (walletId) => {
    if (!walletId) {
      return;
    }

    try {
      const originalWallet = await Application(app => app.get_wallet_by_id(walletId));
      const favouriteWallet = await new Wallet(originalWallet);
      this.props.setFavouriteWallet(favouriteWallet);
    } catch (e) {
      printError(e);
    }
  }

  navigateToNewWalletScreen = () => {
    NavigationService.navigate('NewWalletScreen');
  }

  navigateToSendScreen = () => {
    NavigationService.navigate('SendScreen');
  }

  onRefresh = async () => {
    await this.setState({ isRefreshing: true });
    await this.getWallets();
    await this.setState({ isRefreshing: false });
  }

  render() {
    const { favouriteWallet, wallets, walletsListDirty } = this.props;
    return (
      <Container>
        <ActionHeader
          title={t('Wallets')}
        />
        <WalletList
          wallets={wallets}
          favouriteWallet={favouriteWallet}
          isLoading={walletsListDirty}
          refreshing={this.state.isRefreshing}
          onRefresh={this.onRefresh}
        />
      </Container>
    );
  }
}

Wallets.propTypes = {
  walletToEdit: PropTypes.shape(Wallet),
  walletToSend: PropTypes.shape(Wallet),
  refreshWalletsList: PropTypes.func.isRequired,
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)),
  walletsListDirty: PropTypes.bool,
  setFavouriteWallet: PropTypes.func.isRequired,
  setNetworks: PropTypes.func.isRequired,
  favouriteWallet: PropTypes.shape(Wallet),
};

Wallets.defaultProps = {
  wallets: [],
  walletToEdit: null,
  walletToSend: null,
  walletsListDirty: true,
  favouriteWallet: null,
};

const WalletsScreen = connect(mapStateToProps, mapDispatchToProps)(Wallets);

export default WalletsScreen;
