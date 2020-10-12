import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../common/i18n';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  body: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.white,
    marginTop: -(200 + screenHelper.topHeight) / 2 + 23,
    elevation: 1,
    paddingVertical: 30,
    paddingHorizontal: 23,
  },
  block: {
    marginTop: 24,
  },
  dappName: {
    fontSize: 20,
    color: color.black,
    fontWeight: 'bold',
    fontFamily: 'Avenir-Heavy',
  },
  dappUrl: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: 'Avenir-Book',
    marginTop: 6,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  content: {
    fontFamily: 'Avenir-Book',
    color: color.mineShaft,
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    width: '100%',
    height: 53,
    backgroundColor: color.concrete,
    marginTop: 12,
    shadowColor: color.approxGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  btnsView: {
    position: 'absolute',
    bottom: 40,
    left: 23,
    right: 23,
  },
  btn: {
    width: '100%',
    height: 40,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderColor: color.vividBlue,
    borderWidth: 2,
  },
  rejectText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    fontWeight: 'bold',
    color: color.vividBlue,
  },
});

class WalletConnected extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const {
      disconnect, dappName, dappUrl, address,
    } = this.props;

    return (
      <>
        <View>
          <View>
            <Text style={styles.dappName}>{dappName}</Text>
          </View>
          <Text style={styles.dappUrl}>{dappUrl}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>{strings('page.wallet.walletconnect.connected')}</Text>
          <Text style={styles.content}>
            {strings('page.wallet.walletconnect.connectedWallet', { dappName })}
          </Text>
          <View style={styles.address}>
            <Text style={styles.content}>{address}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>{strings('page.wallet.walletconnect.waitingForOperations')}</Text>
          <Text style={styles.content}>
            {strings('page.wallet.walletconnect.waitingForOperationsDesc', { dappName })}
          </Text>
        </View>

        <View style={styles.btnsView}>
          <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={disconnect}>
            <Text style={styles.rejectText}>{strings('page.wallet.walletconnect.disconnect')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

WalletConnected.propTypes = {
  disconnect: PropTypes.func.isRequired,
  dappName: PropTypes.string.isRequired,
  dappUrl: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default WalletConnected;
