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
import Tags from '../../components/common/misc/tags';

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
  phrasesBorder: {
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
      let phrases = 'camp lazy topic stomach oyster behind know music melt raccoon during spirit'.split(' ');
      this.state = {
        walletName: '',
        phrases: phrases,
        phrase: '',
      };
      this.inputWord = this.inputWord.bind(this);
      this.deleteWord = this.deleteWord.bind(this);
      
    }
    inputWord(){
      this.state.phrases.push(this.state.phrase);
      this.setState({phrases: this.state.phrases});
      this.setState({phrase: ''});
    }
    deleteWord(i){
      this.state.phrases.splice(i, 1);
      this.setState({phrases: this.state.phrases});
    }
    render() {
      return (
        <ScrollView style={[flex.flex1]}>
          <Header title="Recovery Phrase" goBack={this.props.navigation.goBack}/>
          <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
            <Text style={[styles.sectionTitle]}>Type the recovery phrase(usually 12 words)</Text>
            <Input style={styles.input} onChangeText={(text)=>this.setState({phrase: text})} onSubmitEditing={()=>{
              this.inputWord();
            }} value={this.state.phrase}/>
          </View>
          <View style={[styles.sectionContainer, styles.phrasesBorder]}>
              <Tags data={this.state.phrases} onPress={(i)=>{
                this.deleteWord(i);
              }} />
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
              let phrases = '';
              for (let i = 0; i < this.state.phrases.length; i++) {
                if(i!==0){
                  phrases += ' ';
                }
                phrases += this.state.phrases[i];
              }
              navigation.navigate('WalletSelectCurrency', {phrases});
            }} />
          </View>
        </ScrollView>
      );
    }
}
