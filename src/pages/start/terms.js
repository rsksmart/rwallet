import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import Button from '../../components/common/button/button';
import TermRow from './term.row';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '10%',
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
  },
  completeTerms: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeTermsText: {
    marginBottom: 10,
    color: '#00B520',
  },
  termsView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsView2: {
    width: '75%',
  },
  termRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  termRowLeft: {
    marginRight: 15,
    paddingTop: 3,
  },
  check: {
    color: '#00B520',
  },
  termRowRight: {
    width: 0,
    flexGrow: 1,
    flex: 1,
  },
  termRowRightText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '300',
    letterSpacing: 0.32,
  },
});
export default class TermsPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    return (
      <View style={styles.page}>
        <Image style={styles.logo} source={logo} />

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.completeTerms}>
            <Text style={styles.completeTermsText}>View complete Terms of Use</Text>
          </TouchableOpacity>
          <Button style={styles.button} text="COMFIRM & FINISH" onPress={() => {}} />
        </View>
        <View style={styles.termsView}>
          <View style={styles.termsView2}>
            <TermRow
              text="I understand that my funds are held securely on this device, not by a company."
              delay={0}
            />
            <TermRow
              text="I understand that this app is moved to another device or deleted, my bitcoin can only be recoverd with the recovery phrase."
              delay={0.5}
            />
            <TermRow text="I have, read, understood, and agree to the Terms of use." delay={1} />
          </View>
        </View>
      </View>
    );
  }
}
