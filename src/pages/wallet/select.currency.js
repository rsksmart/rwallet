import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList
} from 'react-native';



import flex from '../../assets/styles/layout.flex';
import IconList from '../../components/common/list/iconList';
import SwitchListItem from '../../components/common/list/switchListItem';
import CoinTypeList from '../../components/wallet/coin.type.list';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import Button from '../../components/common/button/button';
import { StackActions, NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
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
        selected: true,
      },
      {
        id: '2',
        title: 'RBTC',
        icon: require('../../assets/images/icon/RBTC.png'),
        selected: true,
      },
      {
        id: '3',
        title: 'RIF',
        icon: require('../../assets/images/icon/RIF.png'),
        selected: true,
      },
    ];

    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };

    render() {
      let phrases = this.props.navigation.state.params ? this.props.navigation.state.params.phrases : '';
      return (
        <View style={[flex.flex1]}>
          <Header title="Select Wallet Currency" goBack={this.props.navigation.goBack}/>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mainnet</Text>
            <CoinTypeList data={this.mainnet}/>
          </View>
          <View style={{alignItems: 'center', flex: 1}}>
            <View style={styles.buttonView}>
              <Button text="CREATE" onPress={async () => {
                let coins = [];
                for(let i=0; i<this.mainnet.length; i++){
                  if(this.mainnet[i].selected){
                    coins.push(this.mainnet[i].title);
                  }
                }
                const { navigation } = this.props;
                let wallet = await walletManager.createWallet(phrases, null, coins);
                if(phrases){
                  await walletManager.addWallet(wallet);
                  const resetAction = StackActions.reset({
                    index: 1,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Test1' }),
                      NavigationActions.navigate({ routeName: 'WalletList' })
                    ],
                  });
                  navigation.dispatch(resetAction);
                } else {
                  navigation.navigate('RecoveryPhrase', {wallet});
                }
              }} />
            </View>
          </View>
        </View>
      );
    }
}


export default WalletSelectCurrency;
