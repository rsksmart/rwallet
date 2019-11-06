import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
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

class Test4 extends Component {
  static navigationOptions = {};
  constructor(props) {
		super(props);
		this.state = {
			seed: '',
			seedPhrase: '',
      master: '',
      globalRootNode: {path:'', public_key: ''},
      localRootNode: {path:'', public_key: ''},
      childPublicKey: {path:'', public_key: ''},
      address: '',
		};
		this.onGreateSeedButtonPressed = this.onGreateSeedButtonPressed.bind(this);
    this.onCreatePrivateKeyButtonPressed = this.onCreatePrivateKeyButtonPressed.bind(this);
	}
	onGreateSeedButtonPressed(){
		let mnemonic = wallet.generateMnemonic();
    let seedPhrase = mnemonic.phrase;
		let seed = mnemonic.toSeed();
		this.setState({seed, seedPhrase});
	}
  async onCreatePrivateKeyButtonPressed(){
    let master = await wallet.generate_master_from_recovery_phrase(this.state.seedPhrase);
    let globalRootNode = wallet.generate_root_node_from_master(master);
    let localRootNode = wallet.generate_local_root_node(globalRootNode, 0);
    let childPublicKey = wallet.generate_child_public_key(localRootNode, 0);
    let address = wallet.get_receive_address(childPublicKey);
    this.setState({master, globalRootNode, localRootNode, childPublicKey, address});
  }
  render() {
    return (
      <ScrollView style={{ marginBottom: 5 }}>
        <View style={[flex.flex1]}>
        	<View>
  			    <Text>seed: {this.state.seed}</Text>
  			    <Text style={styles.red}>seedPhrase: {this.state.seedPhrase}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} 
            	onPress={()=>{this.onGreateSeedButtonPressed();}}>
            	<Text style={styles.text}>Greate Seed</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>master: {this.state.master}</Text>
            <Text>globalRootNode.path: {this.state.globalRootNode.path}</Text>
            <Text>globalRootNode.public_key: {this.state.globalRootNode.public_key}</Text>
            <Text>localRootNode.path: {this.state.localRootNode.path}</Text>
            <Text>localRootNode.public_key: {this.state.localRootNode.public_key}</Text>
            <Text>childPublicKey.path: {this.state.childPublicKey.path}</Text>
            <Text>childPublicKey.public_key: {this.state.childPublicKey.public_key}</Text>
            <Text style={styles.red}>address: {this.state.address}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button} 
              onPress={()=>{this.onCreatePrivateKeyButtonPressed();}}>
              <Text style={styles.text}>Greate Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Test4;
