import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import wallet from '../../common/wallet/wallet';
import Tags from '../../components/common/misc/tags';
import Button from '../../components/common/button/button';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import Alert from '../../components/common/modal/alert';

const styles = StyleSheet.create({
    text: {},
    note: {
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 20,
      marginHorizontal: 45,
      fontWeight: '500',
      letterSpacing: 0.29,
    },
    copy: {
      textAlign: 'center',
      color: '#00B520',
      fontSize: 15,
    },
    tagsView: {
      marginTop: 15,
      marginHorizontal: 20,
    },
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 10,
      width: '100%',
    }
});

export default class RecoveryPhrase extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    constructor(props){
      super(props);
      this.wallet = this.props.navigation.state.params.wallet;
      let phrases = this.wallet.mnemonic.phrase.split(' ');
      this.state = {
        phrases: phrases,
      };
    }
    componentDidMount(){
      this.alert.setModalVisible(true);
    }
    render() {
      return (
        <View style={[flex.flex1]}>
          <Header title="Recovery Phrase" goBack={this.props.navigation.goBack}/>
          <Text style={[styles.note, {marginTop: 20}]}>Write down or copy these words in</Text>
          <Text style={styles.note}>the right order and save them</Text>
          <Text style={styles.note}>somewhere safe</Text>
          <View style={styles.tagsView}>
            <Tags data={this.state.phrases} />
          </View>
          <TouchableOpacity style={{marginTop: 10}} onPress={() => {}} >
            <Text style={styles.copy}>Copy</Text>
          </TouchableOpacity>
          <View style={styles.buttonView}>
            <Button text="NEXT" onPress={async () => {
              const { navigation } = this.props;
              await walletManager.addWallet(this.wallet);
              const resetAction = StackActions.reset({
                index: 1,
                actions: [
                  NavigationActions.navigate({ routeName: 'Test1' }),
                  NavigationActions.navigate({ routeName: 'WalletList' })
                ],
              });
              this.props.navigation.dispatch(resetAction);
            }} />
          </View>
          <Alert ref={(ref) => { this.alert = ref; }} title="Safeguard your recovery phrase" text="Your recovery phrase is composed of 12 randomly selected words. Please carefully write down each word in the order they appear." />
        </View>
      );
    }
}
