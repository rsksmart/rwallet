import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

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
    fontFamily: 'Avenir',
  },
  dappUrl: {
    color: '#9B9B9B',
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: 6,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    fontSize: 16,
  },
  content: {
    fontFamily: 'Avenir',
    color: '#2D2D2D',
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    width: '100%',
    height: 53,
    backgroundColor: '#F3F3F3',
    marginTop: 12,
    shadowColor: '#909090',
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
    borderColor: '#028CFF',
    borderWidth: 2,
  },
  rejectText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#028CFF',
  },
  allowBtn: {
    marginTop: 18,
    backgroundColor: '#028CFF',
  },
  allowText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 'bold',
    color: color.white,
  },
});

class WalletConnecting extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const {
      approve, reject, address, dappName, dappUrl,
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
          <Text style={styles.title}>Request</Text>
          <Text style={styles.content}>
            {dappName}
            {' '}
            requests to connect your wallet
          </Text>
          <View style={styles.address}>
            <Text style={styles.content}>{address}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>Concent</Text>
          <Text style={styles.content}>Clicking on Allow, you agree to,</Text>
          <Text style={styles.content}>- Allow getting current wallet address</Text>
          <Text style={styles.content}>- Allow signature request from the current wallet</Text>
        </View>

        <View style={styles.btnsView}>
          <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={reject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.allowBtn]} onPress={approve}>
            <Text style={styles.allowText}>Allow</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

WalletConnecting.propTypes = {
  approve: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  dappName: PropTypes.string.isRequired,
  dappUrl: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default WalletConnecting;
