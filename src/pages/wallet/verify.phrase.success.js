import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';
import Header from '../../components/common/misc/header';
import Button from '../../components/common/button/button';

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
      return (
        <View style={[flex.flex1]}>
          <Header title="Verify Phrase Success" />
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Text style={styles.title}>Your recovery phrase is verified</Text>
            <Text style={styles.text}>
              Be sure to store your recovery phrase in a safe and secure place
            </Text>
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
