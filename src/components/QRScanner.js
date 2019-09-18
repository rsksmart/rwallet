import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Icon,
  View,
} from 'native-base';
import { BarCodeScanner } from 'expo-barcode-scanner';
import platform from 'mellowallet/native-base-theme/variables/platform';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  barcodeScanner: {
    flex: 1,
  },
  barcodeScannerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backButtonForQRView: {
    position: 'absolute',
    top: platform.isIphoneX ? 40 : 15,
    left: 8,
  },
  iconBack: {
    color: '#FFF',
  },
  pointer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 50,
    borderColor: '#17EAD9',
    borderWidth: 4,
    backgroundColor: 'transparent',
  },
});

const QRScanner = props => (
  <View style={styles.barcodeScannerContainer}>
    <BarCodeScanner
      onBarCodeScanned={props.handleBarCodeScanned}
      style={styles.barcodeScanner}
    />
    <Button
      transparent
      style={styles.backButtonForQRView}
      onPress={props.handleCancelCodeScan}
    >
      <Icon name="ios-arrow-back" style={styles.iconBack} />
    </Button>
    <View style={styles.pointer} />
  </View>
);

QRScanner.propTypes = {
  handleBarCodeScanned: PropTypes.func.isRequired,
  handleCancelCodeScan: PropTypes.func.isRequired,
};

export default QRScanner;
