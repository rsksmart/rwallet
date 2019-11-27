import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import AntDesign from 'react-native-vector-icons/AntDesign';
import WalletTypeList from '../../components/wallet/wallet.type.list';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';

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
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Add Wallet" goBack={navigation.goBack} />
          <WalletTypeList data={this.listData} />
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
