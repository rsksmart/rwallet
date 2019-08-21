import React from 'react';
import {
  Keyboard,
  Platform,
  Share,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo';
import {
  Icon,
} from 'native-base';
import { t } from 'mellowallet/src/i18n';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import material from 'mellowallet/native-base-theme/variables/material';
import NavigationService from 'mellowallet/src/services/NavigationService';
import { setWalletToSend } from 'mellowallet/src/store/actions/wallet';
import Wallet from 'mellowallet/src/store/models';
import { showToast } from 'mellowallet/src/utils';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    favouriteWallet: rootReducer.favouriteWallet,
  };
};

const mapDispatchToProps = dispatch => ({
  setWalletToSend: (wallet, showQR) => dispatch(setWalletToSend(wallet, showQR)),
});

const styles = StyleSheet.create({
  actionButtonIcon: {
    color: '#FFF',
    fontSize: 20,
  },
  view: {
    bottom: 100,
  },
  textContainerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const closedFabIcon = <Icon name="flash" type="Entypo" style={{ color: '#FFF' }} />;
const openedFabIcon = <Icon name="cross" type="Entypo" style={{ color: '#FFF' }} />;

class FabButtonComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFab: true,
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onScanQRPress = () => {
    const { favouriteWallet } = this.props;
    if (!favouriteWallet) {
      this.displayFavouriteWalletError();
      return;
    }

    this.props.setWalletToSend(favouriteWallet, true);
  }

  onPressSecondaryFab = (screen) => {
    NavigationService.navigate(screen);
  }

  dispatchNewWalletCreation = () => {
    NavigationService.navigate('NewWalletScreen');
  }

  dispatchSendAction = () => {
    const { favouriteWallet } = this.props;
    if (!favouriteWallet) {
      this.displayFavouriteWalletError();
      return;
    }

    this.props.setWalletToSend(favouriteWallet);
  }

  displayFavouriteWalletError = () => showToast(
    t("You don't have any Mellow wallet yet. Let's create the first one!"),
    'danger',
  )

  dispatchShareAction = () => {
    const { favouriteWallet } = this.props;
    if (!favouriteWallet) {
      this.displayFavouriteWalletError();
      return;
    }
    const { addresses } = favouriteWallet;
    Share.share({
      message: addresses[0],
      title: t('Take my wallet address to send me money'),
    });
  }

  keyboardDidShow() {
    this.setState({ showFab: false });
  }

  keyboardDidHide() {
    this.setState({ showFab: true });
  }

  render() {
    if (!this.state.showFab) {
      return null;
    }

    const backDrop = (
      <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill} />
    );

    return (
      <ActionButton
        autoInactive
        renderIcon={active => (active && openedFabIcon) || closedFabIcon}
        degrees={0}
        backdrop={backDrop}
        buttonColor="#17EAD9"
        offsetY={(material.isIphoneX && 105) || 70}
        offsetX={15}
        bgColor={Platform.select({
          ios: 'rgba(0,0,0,0.4)',
          android: 'rgba(0,0,0,0.6)',
        })}
        nativeFeedbackRippleColor="transparent"
        fixNativeFeedbackRadius
        shadowStyle={{
          shadowOpacity: 0.26,
        }}
      >
        <ActionButton.Item
          size={45}
          buttonColor={material.brandPrimary}
          onPress={this.dispatchNewWalletCreation}
          title={t('New Wallet')}
          hideLabelShadow
          textContainerStyle={styles.textContainerStyle}
          textStyle={styles.label}
          nativeFeedbackRippleColor="transparent"
        >
          <Icon name="account-balance-wallet" style={styles.actionButtonIcon} color="#FFF" />
        </ActionButton.Item>
        <ActionButton.Item
          size={45}
          buttonColor={material.brandPrimary}
          onPress={this.dispatchSendAction}
          title={t('Send from my fav wallet')}
          hideLabelShadow
          textContainerStyle={styles.textContainerStyle}
          textStyle={styles.label}
        >
          <Icon name="send" style={styles.actionButtonIcon} color="#FFF" />
        </ActionButton.Item>
        <ActionButton.Item
          size={45}
          buttonColor={material.brandPrimary}
          onPress={this.dispatchShareAction}
          title={t('Share')}
          hideLabelShadow
          textContainerStyle={styles.textContainerStyle}
          textStyle={styles.label}
        >
          <Icon name="share" style={styles.actionButtonIcon} color="#FFF" />
        </ActionButton.Item>
        <ActionButton.Item
          size={45}
          buttonColor={material.brandPrimary}
          onPress={this.onScanQRPress}
          title={t('Scan QR')}
          hideLabelShadow
          textContainerStyle={styles.textContainerStyle}
          textStyle={styles.label}
        >
          <Icon name="qrcode" type="MaterialCommunityIcons" style={styles.actionButtonIcon} color="#FFF" />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

FabButtonComponent.propTypes = {
  setWalletToSend: PropTypes.func.isRequired,
  favouriteWallet: PropTypes.shape(Wallet),
};

FabButtonComponent.defaultProps = {
  favouriteWallet: null,
};

const FabButton = connect(mapStateToProps, mapDispatchToProps)(FabButtonComponent);

export default FabButton;
