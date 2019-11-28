import React, { Component } from 'react';
import {
  View, ImageBackground, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import AntDesign from 'react-native-vector-icons/AntDesign';
import WalletTypeList from '../../components/wallet/wallet.type.list';
import flex from '../../assets/styles/layout.flex';
import Loc from '../../components/common/misc/loc';

const header = require('../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
  body: {
    marginTop: 180,
  },
});

class WalletAddIndex extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        id: '1',
        title: 'Create Basic Wallet',
        text: 'Recommended for first-time user',
        icon: (<AntDesign name="wallet" size={25} style={{ color: '#515151' }} />),
        onPress: () => {
          this.createWalletFlow('WalletSelectCurrency');
        },
      },
      {
        id: '2',
        title: 'Import existing Wallet',
        text: 'Recover your wallet using your passphrase',
        icon: (<AntDesign name="download" size={25} style={{ color: '#515151' }} />),
        onPress: () => {
          this.createWalletFlow('WalletRecovery');
        },
      },
    ];

    constructor(props) {
      super(props);
      this.createWalletFlow = this.createWalletFlow.bind(this);
    }

    async createWalletFlow(page) {
      const { navigation } = this.props;
      navigation.navigate(page);
    }

    render() {
      return (
        <View style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Add Wallet" />
          </ImageBackground>
          <WalletTypeList style={[styles.body]} data={this.listData} />
        </View>
      );
    }
}

export default WalletAddIndex;

WalletAddIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
