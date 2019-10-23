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

function Item({address}) {
  return (
    <View>
      <Text>{address}</Text>
    </View>
  );
}

class Test4 extends Component {
  static navigationOptions = {};
  constructor(props) {
		super(props);
    this.state = {
      data: [{address: '111'}],
      seed: '',
      seedPhrase: '',
    }
    this.onCreateBTCWalletButtonPressed = this.onCreateBTCWalletButtonPressed.bind(this);
	}

  // onGreateSeedButtonPressed(){
  //   let mnemonic = wallet.generateMnemonic();
  //   let seedPhrase = mnemonic.phrase;
  //   let seed = mnemonic.toSeed();
  //   this.setState({seed, seedPhrase});
  // }

  async componentDidMount(){
    let mnemonic = await wallet.getMnemonic();
    this.setState({seed: mnemonic.seed, seedPhrase: mnemonic.phrase})
  }
  async onCreateBTCWalletButtonPressed(){
    
  }
  render() {
    return (
      <ScrollView>
        <View>
            <Text>seed: {this.state.seed}</Text>
            <Text style={styles.red}>seedPhrase: {this.state.seedPhrase}</Text>
          </View>
        <FlatList data={this.state.data}
          renderItem={({item})=><Item address={item.address} />}
          keyExtractor={(item) => Math.random()+''}
        />
        <TouchableOpacity style={styles.button} 
          onPress={()=>{this.onCreateBTCWalletButtonPressed();}}>
          <Text style={styles.text}>Greate BTC Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default Test4;
