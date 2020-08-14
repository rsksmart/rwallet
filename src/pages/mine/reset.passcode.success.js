import React, { Component } from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions, NavigationActions } from 'react-navigation';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/headers/header';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color';

const completed = require('../../assets/images/icon/completed.png');

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: 100,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: '300',
    color: color.black,
  },
});

export default class ResetPasscodeSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.onBackButtonPress = this.onBackButtonPress.bind(this);
    }

    onBackButtonPress() {
      const { navigation } = this.props;
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'MineIndex' }),
          NavigationActions.navigate({ routeName: 'TwoFactorAuth' }),
        ],
      });
      navigation.dispatch(resetAction);
    }

    render() {
      const { navigation } = this.props;
      const { operation } = navigation.state.params;
      const title = operation === 'create' ? 'page.mine.resetPasscodeSuccess.title.create' : 'page.mine.resetPasscodeSuccess.title.reset';
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader={false}
          bottomBtnText="button.backToSetting"
          bottomBtnOnPress={this.onBackButtonPress}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPress} title={title} />}
        >
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text={title} />
          </View>
        </BasePageGereral>
      );
    }
}

ResetPasscodeSuccess.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
