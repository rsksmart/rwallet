import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList
} from 'react-native';

import flex from '../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 12,
    minWidth: 130,
    marginTop: 12,
    marginLeft: 10,
  },
  text: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  red: {
    color: 'red',
    fontWeight: '900',
  },
});

function Item({networkName, address}) {
  let text = null;
  if(networkName==='RBTC'){
    text = <Text style={{color: 'red'}}>{networkName}: {address}</Text>
  } else {
    text = <Text>{networkName}: {address}</Text>
  }
  return (
    <View>
      {text}
    </View>
  );
}

class Test4 extends Component {
  static navigationOptions = {};
  constructor(props) {
		super(props);
    this.state = {
      data: [],
      master: '',
      phrase: ''
    }
    this.onCreateBTCWalletButtonPressed = this.onCreateBTCWalletButtonPressed.bind(this);
    this.btcCount = 0;
    this.rbtcCount = 0;
	}

  // onGreateSeedButtonPressed(){
  //   let mnemonic = wallet.generateMnemonic();
  //   let seedPhrase = mnemonic.phrase;
  //   let seed = mnemonic.toSeed();
  //   this.setState({seed, seedPhrase});
  // }

  async componentDidMount(){
    let {master, phrase} = await wallet.getMaster();
    this.setState({master, phrase});
  }
  async onCreateBTCWalletButtonPressed(){
    let master = this.state.master;
    let networkName = 'BTC'
    let networkId = 0;
    let rootNode = wallet.generate_root_node_from_master(master, networkId);
    console.log(`rootNode: ${JSON.stringify(rootNode)}`);
    let localRootNode = wallet.generate_local_root_node(rootNode, this.btcCount);
    let childPublicKey = wallet.generate_child_public_key(localRootNode, 0);
    let address = wallet.get_receive_address(childPublicKey);
    this.setState({data: [...this.state.data, {networkName, address}]});
    this.btcCount++;
  }
  async onCreateRBTCWalletButtonPressed(){
    let master = this.state.master;
    let networkName = 'RBTC'
    let networkId = 137;
    wallet.setNetworkId(networkId);
    let rootNode = wallet.generate_root_node_from_master(master, networkId);
    let localRootNode = wallet.generate_local_root_node(rootNode, this.rbtcCount);
    let childPublicKey = wallet.generate_child_public_key(localRootNode, 0);
    let address = wallet.get_receive_address(childPublicKey);
    this.setState({data: [...this.state.data, {networkName, address}]});
    this.rbtcCount++;
  }
  render() {
    return (
      <ScrollView>
        <View>
          <Text>seedPhrase: {this.state.phrase}</Text>
          <Text>master: {this.state.master}</Text>
        </View>
        <Text style={{marginTop: 10, fontWeight: '900', fontSize: 20}}>Wallet List</Text>
        <FlatList data={this.state.data}
          renderItem={({item})=><Item address={item.address} networkName={item.networkName} />}
          keyExtractor={(item) => Math.random()+''}
        />
        <TouchableOpacity style={styles.button} 
          onPress={()=>{this.onCreateBTCWalletButtonPressed();}}>
          <Text style={styles.text}>Greate BTC Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} 
          onPress={()=>{this.onCreateRBTCWalletButtonPressed();}}>
          <Text style={styles.text}>Greate RBTC Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default Test4;
