import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, ScrollView
} from 'react-native';

import flex from '../../assets/styles/layout.flex';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import wm from '../../common/wallet/walletManager';

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
  addAsset: {
    color: '#77869E',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addCircle: {
    marginLeft: 10,
    marginRight: 10,
  }
});

class WalletList extends Component {
    static navigationOptions = {};
    constructor(props) {
      super(props);
      this.refreshData = this.refreshData.bind(this);
      this.state = {
        listData: [],
      }
    }
    componentDidMount(){
      this.subscription = DeviceEventEmitter.addListener('UPDATE_USER_DATA', this.refreshData)
      this.refreshData();
    }
    refreshData(){
      this.wallets = wm.wallets;
      let listData = [];
      this.wallets.forEach((wallet, i)=>{
        let wal = {name: wallet.name, coins: [] };
        wallet.coins.forEach((coin)=>{
          let item = {
            key: Math.random()+'',
            title: coin.type,
            text: coin.type + ' Wallet',
            worth: '$0',
            amount: coin.amount + ''
          };
          wal.coins.push(item);
        });
        listData.push(wal);
      });
      this.setState({
        listData: listData
      })
    }
    componentWillUnmount() {
      this.subscription.remove();
    };
    render() {
      const {navigation} = this.props;
      let accounts = [];
      for (var i = 0; i < this.state.listData.length; i++) {
        let item = this.state.listData[i];
        let section = (<View key={Math.random()+''}>
          <Text style={styles.sectionTitle}>{item.name}</Text>
          <SwipableButtonList data={item.coins} />
        </View>);
        accounts.push(section);
      }
      return (
        <View style={[flex.flex1]}>
          <ScrollView>
          <View style={styles.sectionContainer}>
            {accounts}
          </View>
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              onPress={()=>{
                navigation.navigate('WalletAddIndex');
              }}>
              <View style={styles.addAsset}><Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} /><Text>Add Asset</Text></View>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      );
    }
}

export default WalletList;
