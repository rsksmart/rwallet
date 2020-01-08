import React, { Component } from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import SafeAreaView from '../../components/common/misc/safe.area.view';


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
    color: '#000000',
  },
});

export default class ResetPasscodeSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      const { navigation } = this.props;
      return (
        <SafeAreaView>
          <View style={[flex.flex1]}>
            <Header
              title="Reset Passcode"
              goBack={() => {
                navigation.goBack();
              }}
            />
            <View style={screenHelper.styles.body}>
              <View style={styles.content}>
                <Image style={styles.check} source={completed} />
                <Loc style={[styles.title]} text="Reset completed!" />
              </View>
            </View>
            <View style={styles.buttonView}>
              <Button
                text="BACK TO SETTING"
                onPress={async () => {
                  const resetAction = StackActions.reset({
                    index: 1,
                    actions: [
                      NavigationActions.navigate({ routeName: 'MineIndex' }),
                      NavigationActions.navigate({ routeName: 'TwoFactorAuth' }),
                    ],
                  });
                  navigation.dispatch(resetAction);
                }}
              />
            </View>
          </View>
        </SafeAreaView>
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
