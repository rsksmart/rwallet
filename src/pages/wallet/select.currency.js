import React, { Component } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import flex from '../../assets/styles/layout.flex';
import IconList from '../../components/common/list/iconList';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

const testnet = [
  {
    id: '1',
    title: 'BTC Testnet',
    icon: require('../../assets/images/icon/BTC.png'),
    onPress: () => {
      // alert('Address Book')
    },
  },
  {
    id: '2',
    title: 'RBTC Testnet',
    icon: require('../../assets/images/icon/RBTC.png'),
    onPress: () => {
      // alert('Address Book')
    },
  },
  {
    id: '3',
    title: 'RIF Testnet',
    icon: require('../../assets/images/icon/RIF.png'),
    onPress: () => {
      // alert('Requires invitation to join')
    },
  },
];

class WalletSelectCurrency extends Component {
    mainnet = [
      {
        id: '1',
        title: 'BTC',
        icon: require('../../assets/images/icon/BTC.png'),
        onPress: () => {
          const { navigation } = this.props;
          navigation.navigate('WalletCreate');
        },
      },
      {
        id: '2',
        title: 'RBTC',
        icon: require('../../assets/images/icon/RBTC.png'),
        onPress: () => {
          // alert('Address Book')
        },
      },
      {
        id: '3',
        title: 'RIF',
        icon: require('../../assets/images/icon/RIF.png'),
        onPress: () => {
          // alert('Requires invitation to join')
        },
      },
    ];

    static navigationOptions = {};

    render() {
      return (
        <View style={[flex.flex1]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mainnet</Text>
            <IconList data={this.mainnet} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Testnet</Text>
            <IconList data={testnet} />
          </View>
        </View>
      );
    }
}


export default WalletSelectCurrency;
