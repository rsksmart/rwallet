import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';

const completed = require('../../assets/images/icon/completed.png');

const styles = StyleSheet.create({
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
    marginTop: 30,
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
  link: {
    color: '#00B520',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const header = require('../../assets/images/misc/header.png');

export default class TransferCompleted extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { navigation } = this.props;
    return (
      <View style={[flex.flex1]}>

        <View style={[{ height: 100 }]}>
          <Image source={header} style={styles.headImage} />
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>Send</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Text style={styles.title}>Transfer Completed! </Text>
            <Text style={styles.text}>Your transaction is on its way.</Text>
            <TouchableOpacity onPress={() => {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'WalletList' }),
                ],
              });
              navigation.dispatch(resetAction);
            }}
            >
              <Text style={[styles.text, styles.link]}>Click to view in explorer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <Button
              text="BACK TO WALLET"
              onPress={() => {
                const resetAction = StackActions.reset({
                  index: 1,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Test1' }),
                    NavigationActions.navigate({ routeName: 'WalletList' }),
                  ],
                });
                navigation.dispatch(resetAction);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

TransferCompleted.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
