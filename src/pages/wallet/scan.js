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
      setTimeout(() => {
        this.onQrcodeDetected('wc:1ffd0f46-42ea-4ae4-8eed-4ffb6641ca6d@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=9c5f2d59c0a71b8c1e84e53f2598e1159ab5c0d38c4bc600472ba0af5fb3a1d4');
      }, 3000);
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
      await this.setState({ uri: data });
      await this.initWalletConnect();
    }

    initWalletConnect = async () => {
      const { uri } = this.state;

      this.setState({ loading: true });

      try {
        const connector = new WalletConnect({ uri });

        if (!connector.connected) {
          await connector.createSession();
        }

        await this.setState({
          loading: false,
          connector,
          uri: connector.uri,
        });

        this.subscribeToEvents();
      } catch (error) {
        this.setState({ loading: false });

        throw error;
      }
    }

    subscribeToEvents = () => {
      console.log('ACTION', 'subscribeToEvents');
      const { connector } = this.state;
      console.log('connector: ', connector);

      console.log('is connector: ', !!connector);

      if (connector) {
        console.log('11111');
        connector.on('session_request', (error, payload) => {
          console.log('EVENT', 'session_request');

          if (error) {
            throw error;
          }

          const { peerMeta } = payload.params[0];
          console.log('payload: ', payload);
          this.setState({ peerMeta });
        });

        connector.on('session_update', (error) => {
          console.log('EVENT', 'session_update');

          if (error) {
            throw error;
          }
        });

        connector.on('call_request', async (error, payload) => {
          // tslint:disable-next-line
          console.log('EVENT', 'call_request', 'method', payload.method);
          console.log('EVENT', 'call_request', 'params', payload.params);

          if (error) {
            throw error;
          }

          // await getAppConfig().rpcEngine.router(payload, this.state, this.bindedSetState);
        });

        connector.on('connect', (error, payload) => {
          console.log('EVENT', 'connect');

          if (error) {
            throw error;
          }

          this.setState({ connected: true });
        });

        connector.on('disconnect', (error, payload) => {
          console.log('EVENT', 'disconnect');

          if (error) {
            throw error;
          }
        });

        if (connector.connected) {
          this.setState({
            connected: true,
          });
        }

        this.setState({ connector });
      }
    };

    // onQrcodeDetected = (data) => {
    //   const { navigation, addNotification } = this.props;
    //   const {
    //     coin, onDetectedAction,
    //   } = navigation.state.params;

    //   this.isAddressValid = Scan.validateAddress(data, coin.symbol, coin.type, coin.networkId);
    //   if (!this.isAddressValid) {
    //     const notification = createErrorNotification(
    //       'modal.invalidAddress.title',
    //       'modal.invalidAddress.body',
    //     );
    //     addNotification(notification);
    //     navigation.goBack();
    //     return;
    //   }

    //   if (onDetectedAction === 'backToTransfer') {
    //     navigation.state.params.onQrcodeDetected(data);
    //     navigation.goBack();
    //   } else {
    //     const resetAction = StackActions.reset({
    //       index: 1,
    //       actions: [
    //         NavigationActions.navigate({ routeName: 'Dashboard' }),
    //         NavigationActions.navigate({ routeName: 'Transfer', params: { coin, toAddress: data } }),
    //       ],
    //     });
    //     navigation.dispatch(resetAction);
    //   }
    // }

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
