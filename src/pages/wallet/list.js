import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, ScrollView
} from 'react-native';

import flex from '../../assets/styles/layout.flex';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/common/misc/header';
import wm from '../../common/wallet/walletManager';
import Parse from 'parse/react-native'

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  sectionContainer: {
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
  },
});

class WalletList extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    constructor(props) {
      super(props);
      this.listData = [];
      this.refreshData = this.refreshData.bind(this);
      this.state = {
        listData: this.listData,
      }
    }
    componentDidMount(){
      this.subscription = DeviceEventEmitter.addListener('UPDATE_USER_DATA', this.refreshData)
      this.refreshData();
    }
    refreshData(){
      this.wallets = wm.wallets;
      let updateValue = (item) => {
        if(item.price!=null && item.amount!==''){
          item.worth = '$' + item.price * item.amount;
        }
      };
      let getBalance = (coin, item)=>{
        let queryKey = coin.queryKey;
        let address = coin.address;
        if(queryKey==='TRSK' || queryKey==='RSK' || queryKey==='RIF' || queryKey==='TRIF'){
          address = address.toLowerCase();
        }
        Parse.Cloud.run('getBalance', {
          name: queryKey,
          addr: address,
        }).then((result)=>{
          console.log(result);
          item.amount = result;
          updateValue(item);
          this.setState({listData: this.listData});
        }).catch((reason)=>{
          console.log(reason);
        });
      };
      let getPrice = (coin, item)=>{
        let queryKey = coin.queryKey;
        Parse.Cloud.run('getTokenPrice', {
          coinTicker: queryKey,
        }).then((result)=>{
          console.log(result);
          item.price = result.price;
          updateValue(item);
          this.setState({listData: this.listData});
        }).catch((reason)=>{
          console.log(reason);
        });
      };

      this.listData = [];
      this.wallets.forEach((wallet, i)=>{
        let wal = {name: `Key ${i+1}`, coins: [] };
        wallet.coins.forEach((coin, j)=>{
          let item = {
            key: Math.random()+'',
            title: coin.defaultName,
            text: coin.type,
            worth: '',
            amount: '',
            price: null,
            icon: coin.icon,
          };
          getBalance(coin, item);
          getPrice(coin, item);
          wal.coins.push(item);
        });
        this.listData.push(wal);
      });

      this.setState({
        listData: this.listData
      });
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
          <Text style={[styles.sectionTitle]}>{item.name}</Text>
          <SwipableButtonList data={item.coins} />
        </View>);
        accounts.push(section);
      }
      return (
        <View style={[flex.flex1]}>
          <ScrollView>
          <Header title="Wallet List" goBack={this.props.navigation.goBack}/>
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
