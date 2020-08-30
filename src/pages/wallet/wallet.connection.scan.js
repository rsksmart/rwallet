import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { connect } from 'react-redux';
import Rsk3 from '@rsksmart/rsk3';
import WalletConnect from '@walletconnect/client';
import { StackActions, NavigationActions } from 'react-navigation';
import color from '../../assets/styles/color';
import OperationHeader from '../../components/headers/header.operation';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import BasePageSimple from '../base/base.page.simple';
import common from '../../common/common';
import { createErrorNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: color.white,
  },
  authorizationContainer: {
    backgroundColor: color.white,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorizationText: {
    position: 'absolute',
    fontFamily: 'Avenir-Roman',
    fontSize: 17,
    bottom: '55%',
    marginHorizontal: 45,
    textAlign: 'center',
    lineHeight: 30,
  },
});

const UnauthorizationView = () => (
  <View style={styles.authorizationContainer}>
    <Loc style={styles.unauthorizationText} text="page.wallet.scan.unauthorization" />
  </View>
);

const PendingView = () => (
  <View style={styles.authorizationContainer}>
    <ActivityIndicator size="small" />
  </View>
);

const WalletConnectionState = {
  connector: null,
  uri: '',
  peerMeta: {
    description: '',
    url: '',
    icons: [],
    name: '',
    ssl: false,
  },
  connected: false,
  chainId: 1,
  requests: [],
  results: [],
  payload: null,
};

class Scan extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static validateAddress(address, symbol, type, networkId) {
      let toAddress = address;
      if (symbol !== 'BTC') {
        try {
          toAddress = Rsk3.utils.toChecksumAddress(address, networkId);
        } catch (error) {
          return false;
        }
      }
      const isAddress = common.isWalletAddress(toAddress, symbol, type, networkId);
      if (!isAddress) {
        return false;
      }
      return true;
    }

    constructor(props) {
      super(props);
      this.isScanFinished = false;

      this.state = {
        ...WalletConnectionState,
      };
    }

    componentDidMount() {
      // setTimeout(() => {
      //   this.onQrcodeDetected('wc:9ada51f1-6d49-4679-892a-c412085cdc8d@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=89578db972a9965dd516bef2e93b5ac03115497716794ed629ec2cd3e9a6ade7');
      // }, 3000);
      this.onQrcodeDetected('wc:d05eaa2e-0ede-48a1-b6dc-017032889072@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=7c0eba1970d31d909eba1188d4f0a9272b9d30b7cd869607a66ea7a9b41af170');
    }

    onBarCodeRead = (scanResult) => {
      const { data } = scanResult;
      if (this.isScanFinished) {
        return;
      }
      this.isScanFinished = true;
      console.log(`scanResult: ${JSON.stringify(scanResult)}`);
      this.onQrcodeDetected(data);
    }

    onQrcodeDetected = async (data) => {
      const { navigation } = this.props;
      navigation.navigate('WalletConnectionPage', { uri: data });
    }

    render() {
      const { navigation } = this.props;
      const barcodeMask = (<BarcodeMask width={240} height={240} edgeBorderWidth={1} showAnimatedLine={false} />);
      const scanner = (
        <RNCamera
          ref={(ref) => { this.camera = ref; }}
          captureAudio={false}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          androidCameraPermissionOptions={{
            title: strings('page.wallet.scan.cameraPermission.title'),
            message: strings('page.wallet.scan.cameraPermission.message'),
            buttonPositive: strings('button.ok'),
            buttonNegative: strings('button.cancel'),
          }}
          onBarCodeRead={this.onBarCodeRead}
        >
          {({ status }) => {
            if (status === 'PENDING_AUTHORIZATION') {
              return <PendingView />;
            }
            if (status === 'NOT_AUTHORIZED') {
              return <UnauthorizationView />;
            }
            return barcodeMask;
          }}
        </RNCamera>
      );

      return (
        <BasePageSimple
          isSafeView={false}
          headerComponent={<OperationHeader title={strings('page.wallet.scan.title')} onBackButtonPress={() => navigation.goBack()} />}
        >
          <View style={styles.body}>
            {scanner}
          </View>
        </BasePageSimple>
      );
    }
}

Scan.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
