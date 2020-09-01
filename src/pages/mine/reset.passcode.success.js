import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import Header from '../../components/headers/header';
import BasePageSimple from '../base/base.page.simple';
import Button from '../../components/common/button/button';
import { strings } from '../../common/i18n';
import operationSuccessStyles from '../../assets/styles/operation.success.style';
import color from '../../assets/styles/color';
import CompletedIcon from '../../components/common/image/completed.icon';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  title: {
    fontSize: screenWidth > 400 ? 24 : 22,
    color: color.black,
    fontFamily: 'Avenir-Book',
    textAlign: 'center',
  },
});

class ResetPasscodeSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onBackButtonPressed = () => {
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
      const title = `page.mine.resetPasscodeSuccess.${operation}.title`;
      const body = `page.mine.resetPasscodeSuccess.${operation}.body`;
      return (
        <BasePageSimple
          isSafeView
          hasBottomBtn
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPressed} title={title} />}
        >
          <View style={operationSuccessStyles.wrapper}>
            <View style={operationSuccessStyles.content}>
              <View style={operationSuccessStyles.centerView}>
                <CompletedIcon style={operationSuccessStyles.check} />
                <Text style={styles.title}>{strings(body)}</Text>
              </View>
            </View>
            <Button style={operationSuccessStyles.button} text="button.backToSetting" onPress={this.onBackButtonPressed} />
          </View>
        </BasePageSimple>
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

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps, null)(ResetPasscodeSuccess);
