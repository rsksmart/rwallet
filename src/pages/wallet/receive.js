import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import wallet from '../../common/wallet/wallet';
import Tags from '../../components/common/misc/tags';
import Button from '../../components/common/button/button';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import Alert from '../../components/common/modal/alert';
import QRCode from 'react-native-qrcode-svg';
import Entypo from 'react-native-vector-icons/Entypo';
import Input from '../../components/common/input/input';
import color from '../../assets/styles/color';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    letterSpacing: 0.39,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  input: {
    height: 50,
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
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  address: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },

  qrView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

const header = require('../../assets/images/misc/header.png');

export default class WalletReceive extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    constructor(props){
      super(props);
    }
    componentDidMount(){}
    render() {
      let address = this.props.navigation.state.params.address;
      let logo = this.props.navigation.state.params.icon;
      let qrSize = 200;
      let qrLogoSize = qrSize*0.3;
      return (
        <View style={[flex.flex1]}>
          <View style={[{height: 100}]}>
            <Image source={header} style={styles.headImage} />
            <View style={styles.headerView}>
              <Text style={styles.headerTitle}>Receive BTC</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
              <Text style={[styles.sectionTitle]}>Address</Text>
              <View style={styles.address}><Text>{address}</Text></View>
            </View>
            <View style={[styles.sectionContainer, styles.qrView]}>
              <QRCode value={address} logo={logo} logoMargin={5} size={qrSize} logoSize={qrLogoSize} />
            </View>
          </View>
        </View>
      );
    }
}
