import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView
} from 'react-native';

import flex from '../../assets/styles/layout.flex';
import Input from '../../components/common/input/input';
import Button from '../../components/common/button/button';
import SwitchListItem from '../../components/common/list/switchListItem';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';

const styles = StyleSheet.create({
  input: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  walletName: {
    fontSize: 20,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 10,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomBorder: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default class WalletRecovery extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    constructor(props) {
      super(props);
      this.state = {
        walletName: '',
        phrase: 'camp lazy topic stomach oyster behind know music melt raccoon during spirit',
      };
    }
    render() {
      return (
        <ScrollView style={[flex.flex1]}>
          <Header title="Recovery Phrase" goBack={this.props.navigation.goBack}/>
          <View style={[styles.sectionContainer, styles.bottomBorder, { paddingBottom: 20 }]}>
            <Text style={[styles.sectionTitle, styles.walletName]}>Wallet Name</Text>
            <Input style={styles.input} onChangeText={(text)=>this.setState({walletName: text})}/>
          </View>
          <View style={[styles.sectionContainer, styles.bottomBorder, { paddingBottom: 20 }]}>
            <Text style={[styles.sectionTitle, styles.walletName]}>Phrase</Text>
            <Input style={styles.input} onChangeText={(text)=>this.setState({walletName: text})} value={this.state.phrase}/>
          </View>
          <View style={[styles.sectionContainer, styles.bottomBorder]}>
            <Text style={[styles.sectionTitle]}>Advanced Options</Text>
            <SwitchListItem title="Single address" value={false} />
          </View>
          <View style={[styles.sectionContainer]}>
            <Text style={[styles.sectionTitle]}>Wallet Service URL</Text>
            <Text>https://bws.bitpay.com/bws/api</Text>
          </View>
          <View style={styles.buttonView}>
            <Button text="CREATE" onPress={async () => {
              const { navigation } = this.props;
              let wallet = await walletManager.createWallet(this.state.walletName, this.state.phrase);
              await walletManager.addWallet(wallet);
              navigation.navigate('WalletList');
            }} />
          </View>
        </ScrollView>
      );
    }
}
