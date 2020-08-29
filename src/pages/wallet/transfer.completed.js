import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/headers/header';
import common from '../../common/common';
import BasePageSimple from '../base/base.page.simple';
import color from '../../assets/styles/color';
import operationSuccessStyles from '../../assets/styles/operation.success.style';
import Button from '../../components/common/button/button';
import CompletedIcon from '../../components/common/image/completed.icon';

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontFamily: 'Avenir-Heavy',
    color: color.black,
  },
  text: {
    color: color.tundora,
    fontSize: 15,
    fontFamily: 'Avenir-Book',
    width: '80%',
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: color.app.theme,
    fontFamily: 'Avenir-Roman',
  },
});

export default class TransferCompleted extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  onBackButtonPressed = () => {
    const { navigation } = this.props;
    const stackActions = StackActions.pop({ n: 2 });
    navigation.dispatch(stackActions);
    navigation.navigate('Home');
  }

  onExplorePressed = () => {
    const { navigation } = this.props;
    const { symbol, type, hash } = navigation.state.params;
    const url = common.getTransactionUrl(symbol, type, hash);
    Linking.openURL(url);
  }

  render() {
    return (
      <BasePageSimple
        isSafeView
        hasBottomBtn
        hasLoader={false}
        headerComponent={<Header onBackButtonPress={this.onBackButtonPressed} title="page.wallet.transferCompleted.title" />}
      >
        <View style={operationSuccessStyles.wrapper}>
          <View style={operationSuccessStyles.content}>
            <View style={[operationSuccessStyles.centerView, styles.centerView]}>
              <CompletedIcon style={operationSuccessStyles.check} />
              <Loc style={[styles.title]} text="page.wallet.transferCompleted.body" />
              <Loc style={[styles.text]} text="page.wallet.transferCompleted.note" />
              <TouchableOpacity onPress={this.onExplorePressed}>
                <Loc style={[styles.text, styles.link]} text="page.wallet.transferCompleted.viewExplorer" />
              </TouchableOpacity>
            </View>
          </View>
          <Button style={operationSuccessStyles.button} text="button.goToWallet" onPress={this.onBackButtonPressed} />
        </View>
      </BasePageSimple>
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
