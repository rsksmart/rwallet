import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList
} from 'react-native';



import flex from '../../assets/styles/layout.flex';
import IconList from '../../components/common/list/iconList';
import SwitchListItem from '../../components/common/list/switchListItem';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import Button from '../../components/common/button/button';

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
  buttonView: {
    position: 'absolute',
    bottom: '10%',
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

    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };

    render() {
      return (
        <View style={[flex.flex1]}>
          <Header title="Recovery Phrase" goBack={this.props.navigation.goBack}/>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mainnet</Text>
            <FlatList
              data={this.mainnet}
              renderItem={({ item }) => <SwitchListItem title={item.title} value={true} />}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={{alignItems: 'center', flex: 1}}>
            <View style={styles.buttonView}>
              <Button text="CREATE" onPress={async () => {
                const { navigation } = this.props;
                let wallet = await walletManager.createWallet('');
                navigation.navigate('RecoveryPhrase', {wallet});
              }} />
            </View>
          </View>
        </View>
      );
    }
}


export default WalletSelectCurrency;
