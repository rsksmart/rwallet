import React, { Component } from 'react';
import {
  View, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import AutoHeightImage from 'react-native-auto-height-image';
import Header, { headerVisibleHeight } from '../../components/headers/header';
import BasePageSimple from '../base/base.page.simple';
import color from '../../assets/styles/color';
import Button from '../../components/common/button/button';
import ResponsiveText from '../../components/common/misc/responsive.text';
import { strings } from '../../common/i18n';

const bottomHeight = 70;
const screenWidth = Dimensions.get('window').width;
const contentHeight = Dimensions.get('window').height - headerVisibleHeight - bottomHeight;

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
    justifyContent: 'center',
    flex: 1,
  },
  check: {
    marginBottom: contentHeight * 0.04,
  },
  title: {
    fontSize: 25,
    color: color.black,
    fontFamily: 'Avenir-Book',
  },
  titleLayout: {
    width: screenWidth * 0.55,
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  centerView: {
    alignItems: 'center',
    marginTop: -contentHeight * 0.25,
  },
  button: {
    marginBottom: contentHeight * 0.037,
  },
});

class ResetPasscodeSuccess extends Component {
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
      const title = `page.mine.resetPasscodeSuccess.${operation}.title`;
      const body = `page.mine.resetPasscodeSuccess.${operation}.body`;
      return (
        <BasePageSimple
          isSafeView
          hasBottomBtn
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPress} title={title} />}
        >
          <View style={styles.wrapper}>
            <View style={styles.content}>
              <View style={styles.centerView}>
                <AutoHeightImage style={styles.check} source={completed} width={screenWidth * 0.27} />
                <ResponsiveText
                  layoutStyle={styles.titleLayout}
                  fontStyle={styles.title}
                  maxFontSize={100}
                >
                  {strings(body)}
                </ResponsiveText>
              </View>
            </View>
            <Button style={styles.button} text="button.backToSetting" onPress={this.onBackButtonPress} />
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
