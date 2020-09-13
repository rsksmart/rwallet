import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Linking, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import Loc from '../../components/common/misc/loc';
import SwapHeader, { headerVisibleHeight } from '../../components/headers/header.swap';
import common from '../../common/common';
import BasePageSimple from '../base/base.page.simple';
import color from '../../assets/styles/color';
import CompletedIcon from '../../components/common/image/completed.icon';
import Button from '../../components/common/button/button';
import operationSuccessStyles from '../../assets/styles/operation.success.style';

const bodyOffsetHeight = -330;
const bottomHeight = 70;
export const contentHeight = Dimensions.get('window').height - (headerVisibleHeight + bodyOffsetHeight) - bottomHeight;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    marginTop: bodyOffsetHeight,
    backgroundColor: color.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.alto,
    borderBottomWidth: 0,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
  },
  check: {
    marginTop: contentHeight * 0.15,
    marginBottom: contentHeight * 0.07,
  },
  title: {
    color: color.black,
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
  },
  text: {
    color: color.tundora,
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    marginTop: 15,
  },
  link: {
    color: color.app.theme,
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    marginTop: 15,
  },
  viewExplorer: {
    marginBottom: 30,
  },
  bottomView: {
    height: 10,
    backgroundColor: color.white,
    width: '100%',
    position: 'absolute',
    bottom: -10,
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
  },
});

export default class SwapCompleted extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  onExplorePressed = () => {
    const { navigation } = this.props;
    const { symbol, type, hash } = navigation.state.params;
    const url = common.getTransactionUrl(symbol, type, hash);
    Linking.openURL(url);
  }

  onBackButtonPressed = () => {
    const { navigation } = this.props;
    const stackActions = StackActions.popToTop();
    navigation.dispatch(stackActions);
    navigation.navigate('Home');
  }

  render() {
    return (
      <BasePageSimple
        isSafeView
        hasBottomBtn
        hasLoader={false}
        headerComponent={<SwapHeader title="page.wallet.swapCompleted.title" onBackButtonPress={this.onBackButtonPressed} />}
      >
        <View style={styles.content}>
          <View style={styles.centerView}>
            <CompletedIcon style={styles.check} />
            <Loc style={[styles.title]} text="page.wallet.swapCompleted.body" />
            <Loc style={[styles.text]} text="page.wallet.swapCompleted.note" />
            <TouchableOpacity style={styles.viewExplorer} onPress={this.onExplorePressed}>
              <Loc style={[styles.link]} text="page.wallet.swapCompleted.viewExplorer" />
            </TouchableOpacity>
          </View>
          <Button style={operationSuccessStyles.button} text="button.goToWallet" onPress={this.onBackButtonPressed} />
          <View style={[styles.bottomView]} />
        </View>
      </BasePageSimple>
    );
  }
}

SwapCompleted.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
