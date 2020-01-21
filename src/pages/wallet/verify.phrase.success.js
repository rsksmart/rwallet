import React, { Component } from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import { StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';

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

    constructor(props) {
      super(props);
      this.onBackPress = this.onBackPress.bind(this);
    }

    onBackPress() {
      const { navigation } = this.props;
      const statckActions = StackActions.popToTop();
      navigation.dispatch(statckActions);
    }

    render() {
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          bottomBtnText="GO TO WALLET"
          bottomBtnOnPress={this.onBackPress}
          hasLoader={false}
          headerComponent={<Header title="Verify Phrase Success" onBackButtonPress={this.onBackPress} />}
        >
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text="Your recovery phrase is verified" />
            <Loc style={[styles.text]} text="Be sure to store your recovery phrase in a safe and secure place" />
          </View>
        </BasePageGereral>
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
