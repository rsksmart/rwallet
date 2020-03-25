import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { connect } from 'react-redux';
import color from '../../assets/styles/color.ts';
import OperationHeader from '../../components/headers/header.operation';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import BasePageSimple from '../base/base.page.simple';

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  authorizationContainer: {
    backgroundColor: color.white,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const UnauthorizationView = () => (
  <View style={styles.authorizationContainer}>
    <Loc text="page.wallet.scan.unauthorization" />
  </View>
);

const PendingView = () => (
  <View style={styles.authorizationContainer}>
    <ActivityIndicator size="small" />
  </View>
);

class Scan extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onBarCodeRead = (scanResult) => {
      const { navigation } = this.props;
      console.log(`scanResult: ${JSON.stringify(scanResult)}`);
      const { data } = scanResult;
      navigation.state.params.onQrcodeDetected(data);
      navigation.goBack();
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
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(Scan);
