import React, { PureComponent } from 'react';
import { Share, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import {
  Icon,
  Button,
  Container,
  Tabs,
  Tab,
} from 'native-base';
import { connect } from 'react-redux';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { PropTypes } from 'prop-types';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import CustomModal from 'mellowallet/src/components/CustomModal';
import Loader from 'mellowallet/src/components/Loader';
import WalletQRModal from 'mellowallet/src/components/Wallet/WalletQRModal';
import { t } from 'mellowallet/src/i18n';
import {
  setFavouriteWallet,
  setWalletListDirty,
  setWalletToEdit,
} from 'mellowallet/src/store/actions/wallet';
import { copy, showToast, printError } from 'mellowallet/src/utils';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import BalanceScreen from './Balance/BalanceScreen';
import AddressesScreen from './Addresses/AddressesScreen';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    walletsListDirty: rootReducer.walletsListDirty,
  };
};

const mapDispatchToProps = dispatch => ({
  setFavouriteWallet: wallet => dispatch(setFavouriteWallet(wallet)),
  setWalletListDirty: () => dispatch(setWalletListDirty()),
  setWalletToEdit: wallet => dispatch(setWalletToEdit(wallet)),
});

class Details extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showQR: false,
      showDeleteAlert: false,
      isLoading: false,
    };
    this.wallet = this.props.navigation.getParam('wallet');
  }

  componentDidMount() {
    this.loadAddresses();
  }

  componentWillReceiveProps(props) {
    const {
      walletsListDirty,
    } = props;

    if (walletsListDirty) {
      this.loadAddresses();
    }
  }

  loadAddresses = () => {
    this.wallet.originalWallet.get_addresses()
      .then((addresses) => {
        this.wallet.addresses = addresses;
      });
  }

  setSettingsRef = (ref) => {
    this.menu = ref;
  }

  hideSettings = () => {
    this.menu.hide();
  };

  showSettings = () => {
    this.menu.show();
  };

  goBack = () => {
    this.props.navigation.goBack();
  }

  onShowQRPress = () => {
    this.setState({ showQR: true });
  }

  onCloseQRModalPress = () => {
    this.setState({ showQR: false });
  }

  onCopyAddressPress = () => {
    this.hideSettings();
    const { addresses } = this.wallet;
    copy(addresses[0], t('Wallet address copied'));
  }

  onEditPress = () => {
    this.hideSettings();
    this.props.setWalletToEdit(this.wallet);
  }

  onBookmarkPress = () => {
    this.hideSettings();
    this.props.setFavouriteWallet(this.wallet);
    showToast(t('Wallet Bookmarked'));
  }

  onSharePress = () => {
    const { addresses } = this.wallet;
    Share.share({
      message: addresses[0],
      title: t('Take my wallet address to send me money'),
    }).then(this.hideSettings);
  }

  onDeletePress = () => {
    this.hideSettings();
    this.setState({ showDeleteAlert: true });
  }

  deleteWallet = async () => {
    this.setState({ showDeleteAlert: false, isLoading: true });
    const favouriteWallet = await AsyncStorage.getItem(AsyncStorageEnum.FAVOURITE_WALLET);
    if (favouriteWallet.toString() === this.wallet.id.toString()) {
      this.setState({ isLoading: false });
      showToast(t('The favourite wallet can not be deleted'), 'danger');
      return;
    }
    this.wallet.originalWallet.delete()
      .then(() => {
        this.props.setWalletListDirty();
        this.props.navigation.goBack();
      })
      .catch(e => printError(e))
      .finally(() => this.setState({ isLoading: false }));
  }

  onCancelDeletePress = () => {
    this.setState({ showDeleteAlert: false });
  }

  renderSettingsButton = () => (
    <Button
      transparent
      onPress={this.showSettings}
    >
      <Icon name="more-vert" />
    </Button>
  )

  renderWalletSettings = () => {
    const settingButton = this.renderSettingsButton();
    return (
      <Menu
        ref={this.setSettingsRef}
        button={settingButton}
      >
        <MenuItem onPress={this.onCopyAddressPress}>{t('Copy Address')}</MenuItem>
        <MenuItem onPress={this.onSharePress}>{t('Share Address')}</MenuItem>
        <MenuDivider />
        <MenuItem onPress={this.onBookmarkPress}>{t('Bookmark Wallet')}</MenuItem>
        <MenuItem onPress={this.onEditPress}>{t('Rename Wallet')}</MenuItem>
        <MenuItem onPress={this.onDeletePress}>{t('Delete')}</MenuItem>
      </Menu>
    );
  }


  render() {
    const { name, network, addresses } = this.wallet;
    const {
      isLoading,
      showQR,
      showDeleteAlert,
    } = this.state;

    const walletSettings = this.renderWalletSettings();
    return (
      <Container>
        <WalletQRModal
          isVisible={showQR}
          onClosePress={this.onCloseQRModalPress}
          walletAddresses={addresses}
          walletName={name}
          walletNetwork={network}
        />
        <CustomModal
          title={t('Delete Wallet')}
          description={t("Are you sure you want to delete this Mellow Wallet? To recover it you'll need the recovery phrase.")}
          visible={showDeleteAlert}
          iconName="priority-high"
          error
          primaryButtonText={t('Ok')}
          onPressPrimaryButton={this.deleteWallet}
          secondaryButtonText={t('Cancel')}
          onPressSecondaryButton={this.onCancelDeletePress}
        />
        <ActionHeader
          title={`${name} (${network})`}
          backAction={this.goBack}
        >
          <Button
            transparent
            onPress={this.onShowQRPress}
          >
            <Icon name="qrcode" type="MaterialCommunityIcons" />
          </Button>
          {walletSettings}
        </ActionHeader>
        <Loader loading={isLoading} />
        <Tabs>
          <Tab heading={t('Balance')}>
            <BalanceScreen wallet={this.wallet} onReceivePressed={this.onShowQRPress} />
          </Tab>
          <Tab heading={t('Addresses')}>
            <AddressesScreen wallet={this.wallet} />
          </Tab>
        </Tabs>

      </Container>
    );
  }
}

Details.propTypes = {
  setWalletToEdit: PropTypes.func.isRequired,
  setWalletListDirty: PropTypes.func.isRequired,
  setFavouriteWallet: PropTypes.func.isRequired,
  walletsListDirty: PropTypes.bool,
};

Details.defaultProps = {
  walletsListDirty: true,
};

const WalletDetails = connect(mapStateToProps, mapDispatchToProps)(Details);
export default withNavigation(WalletDetails);
