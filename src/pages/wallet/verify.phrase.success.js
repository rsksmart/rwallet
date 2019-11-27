import React, { Component } from 'react';
import {
  View, StyleSheet, Image, ImageBackground,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';
import Header from '../../components/common/misc/header';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';

const completed = require('../../assets/images/icon/completed.png');
const header = require('../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: 220,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '300',
    width: '80%',
    marginTop: 15,
    textAlign: 'center',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
});

export default class VerifyPhraseSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      return (
        <View style={[flex.flex1]}>
          <Header title="Verify Phrase Success" />
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Verify Phrase Success" />
          </ImageBackground>
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text="Your recovery phrase is verified" />
            <Loc style={[styles.text]} text="Be sure to store your recovery phrase in a safe and secure place" />
          </View>
          <View style={styles.buttonView}>
            <Button
              text="GO TO WALLET"
              onPress={async () => {
                const { navigation } = this.props;
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'WalletList' }),
                  ],
                });
                navigation.dispatch(resetAction);
              }}
            />
          </View>
        </View>
      );
    }
}

VerifyPhraseSuccess.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
