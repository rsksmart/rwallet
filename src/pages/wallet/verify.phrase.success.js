import React, { Component } from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import { StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color';

const completed = require('../../assets/images/icon/completed.png');

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: color.black,
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
    color: color.black,
  },
  text: {
    color: color.tundora,
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
          bottomBtnText="button.goToWallet"
          bottomBtnOnPress={this.onBackPress}
          hasLoader={false}
          headerComponent={<Header title="page.wallet.verifyPhraseSuccess.title" onBackButtonPress={this.onBackPress} />}
        >
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text="page.wallet.verifyPhraseSuccess.body" />
            <Loc style={[styles.text]} text="page.wallet.verifyPhraseSuccess.note" />
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
