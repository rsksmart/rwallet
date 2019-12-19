import React, { Component } from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import { StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';
import Header from '../../components/common/misc/header';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import screenHelper from '../../common/screenHelper';

const completed = require('../../assets/images/icon/completed.png');

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
    marginTop: 20,
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
});

export default class VerifyPhraseSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header
            title="Verify Phrase Success"
            goBack={() => {
              navigation.goBack();
            }}
          />
          <View style={[screenHelper.styles.body]}>
            <View style={styles.content}>
              <Image style={styles.check} source={completed} />
              <Loc style={[styles.title]} text="Your recovery phrase is verified" />
              <Loc style={[styles.text]} text="Be sure to store your recovery phrase in a safe and secure place" />
            </View>
          </View>
          <View style={styles.buttonView}>
            <Button
              text="GO TO WALLET"
              onPress={async () => {
                const statckActions = StackActions.popToTop();
                navigation.dispatch(statckActions);
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
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
