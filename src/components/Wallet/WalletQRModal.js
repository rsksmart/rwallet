import React from 'react';
import {
  Modal,
  Share,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import QRCode from 'react-native-qrcode';
import {
  Button,
  H1,
  Icon,
  Text,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';
import { t } from 'mellowallet/src/i18n';
import { copy } from 'mellowallet/src/utils';


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  viewWrapped: {
    backgroundColor: '#fff',
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    margin: 15,
  },
  subTitle: {
    textAlign: 'center',
  },
  addressText: {
    fontWeight: 'bold',
  },
  footerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  qrSection: {
    flexDirection: 'row',
  },
  qrView: {
    overflow: 'hidden',
  },
  buttonQRSlider: {
    marginTop: 80,
  },
});

class WalletQRModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addressIndex: 0,
    };
  }

  onCopyPress = () => {
    const { walletAddresses } = this.props;
    copy(walletAddresses[this.state.addressIndex], t('Wallet address copied'));
  }

  onSharePress = () => {
    const { walletAddresses } = this.props;
    Share.share({
      message: walletAddresses[this.state.addressIndex],
      title: t('Take my wallet address to send me money'),
    });
  }

  previousAddress = () => {
    this.setState((prevState) => {
      const { addressIndex } = prevState;
      return { ...prevState, addressIndex: addressIndex && addressIndex - 1 };
    });
  }

  nextAddress = () => {
    this.setState((prevState) => {
      const { addressIndex } = prevState;
      const addressLength = this.props.walletAddresses.length;
      const nextIndex = addressLength - addressIndex === 1 ? addressIndex : addressIndex + 1;
      return { ...prevState, addressIndex: nextIndex };
    });
  }

  render() {
    const {
      walletAddresses,
      walletName,
      walletNetwork,
      isVisible,
      onClosePress,
    } = this.props;

    const walletAddress = walletAddresses[this.state.addressIndex];

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={onClosePress}
      >
        <View style={styles.modalBackground}>
          <View style={styles.viewWrapped}>
            <Button
              transparent
              onPress={onClosePress}
            >
              <Icon name="close" />
            </Button>
            <H1>{walletName}</H1>
            <H1>{`(${walletNetwork})`}</H1>
            <Text
              style={[styles.text, styles.subTitle]}
            >
              {t('Share your wallet address to receive payments')}
            </Text>
            <View style={styles.qrSection}>
              <Button
                transparent
                style={styles.buttonQRSlider}
                onPress={this.previousAddress}
              >
                <Icon name="arrow-back" type="Ionicons" />
              </Button>
              <View style={styles.qrView}>
                <QRCode
                  value={walletAddress}
                  size={200}
                  bgColor="black"
                  fgColor="white"
                />
              </View>
              <Button
                transparent
                style={styles.buttonQRSlider}
                onPress={this.nextAddress}
              >
                <Icon name="ios-arrow-forward" type="Ionicons" />
              </Button>
            </View>
            <Text style={[styles.text, styles.address]}>{walletAddress}</Text>
            <View style={styles.footerView}>
              <Button
                transparent
                onPress={this.onCopyPress}
              >
                <Text>{t('Copy')}</Text>
              </Button>
              <Button
                transparent
                onPress={this.onSharePress}
              >
                <Text>{t('Share')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

WalletQRModal.propTypes = {
  walletAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  walletName: PropTypes.string.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  onClosePress: PropTypes.func.isRequired,
  isVisible: PropTypes.bool,
};

WalletQRModal.defaultProps = {
  isVisible: false,
};


export default WalletQRModal;
