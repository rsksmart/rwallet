import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image
} from 'react-native';
import { Card, CardItem, Body} from 'native-base';
import flex from '../../assets/styles/layout.flex';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/common/misc/header';
import wm from '../../common/wallet/walletManager';
import Parse from 'parse/react-native'

const header = require('../../assets/images/misc/header.png')
const send = require('../../assets/images/icon/send.png')




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
  backButton: {
    position: 'absolute',
    left: 10,
    top: 70,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 24,
    color: '#FFF',
  },
  headerBoard: {
    width: '85%',
    top: 100,
    height: 166,
  },
  headerBoardView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  chevron: {
    color: '#FFF',
  },
  myAssetsTitle: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000'
  },
  myAssets: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000000',
    top: 40,
    left: 5,
  },
  myAssetsButtonsView: {
    position: 'absolute',
    top: 110,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    marginLeft: 10,
    paddingRight: 10,
  },
  sendIcon: {
    color: '#6875B7',
  },
  receiveIcon: {
    color: '#6FC062',
  },
  swapIcon: {
    color: '#656667',
  },
  sendText: {
    color: '#6875B7',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  receiveText: {
    color: '#6FC062',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  swapText: {
    color: '#656667',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  }
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
            <View style={[{height: 300}]}>
              <Image source={header} />
              <View style={styles.headerView}>
                <Text style={styles.headerTitle}>Your Wallet</Text>
                <View style={styles.headerBoardView}>
                  <Card style={styles.headerBoard} >
                    <CardItem>
                      <Body>
                        <Text style={styles.myAssetsTitle}>My Assets ($)</Text>
                        <Text style={styles.myAssets}>173,586.3</Text>
                        <View style={styles.myAssetsButtonsView}>
                          <TouchableOpacity style={styles.ButtonView} onPress={()=>{
                            alert('send');
                          }}>
                            <Entypo name="swap" size={20} style={styles.sendIcon} /><Text style={styles.sendText}>Send</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.ButtonView} onPress={()=>{
                            alert('send');
                          }}>
                            <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} /><Text style={styles.receiveText}>Receive</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.ButtonView, {borderRightWidth: 0}]} onPress={()=>{
                            alert('swap');
                          }}>
                            <AntDesign name="switcher" size={20} style={styles.swapIcon} /><Text style={styles.swapText}>Swap</Text>
                          </TouchableOpacity>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
              </View>
            </View>
             <View style={styles.sectionContainer}>
              <Text style={{color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginLeft: 10, marginBottom: 10}}>All Assets</Text>
            </View>
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
