import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import operationSuccessStyles from '../../assets/styles/operation.success.style';
import Button from '../../components/common/button/button';
import BasePageSimple from '../base/base.page.simple';
import CompletedIcon from '../../components/common/image/completed.icon';

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontFamily: fontFamily.AvenirHeavy,
    color: color.black,
  },
  text: {
    color: color.tundora,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    width: '80%',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default class VerifyPhraseSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onBackButtonPressed = () => {
      const { navigation } = this.props;
      const stackActions = StackActions.popToTop();
      navigation.dispatch(stackActions);
    }

    render() {
      return (
        <BasePageSimple
          isSafeView
          hasBottomBtn
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPressed} title="page.wallet.verifyPhraseSuccess.title" />}
        >
          <View style={operationSuccessStyles.wrapper}>
            <View style={operationSuccessStyles.content}>
              <View style={[operationSuccessStyles.centerView, styles.centerView]}>
                <CompletedIcon style={operationSuccessStyles.check} />
                <Loc style={[styles.title]} text="page.wallet.verifyPhraseSuccess.body" />
                <Loc style={[styles.text]} text="page.wallet.verifyPhraseSuccess.note" />
              </View>
            </View>
            <Button style={operationSuccessStyles.button} text="button.goToWallet" onPress={this.onBackButtonPressed} />
          </View>
        </BasePageSimple>
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
