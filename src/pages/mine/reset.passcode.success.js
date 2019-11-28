import React, { Component } from 'react';
import {
  View, StyleSheet, Image, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';
import appContext from '../../common/appContext';
import Loc from '../../components/common/misc/loc';


const completed = require('../../assets/images/icon/completed.png');
const header = require('../../assets/images/misc/header.png');

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
    marginTop: 200,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: '300',
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
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
});

export default class ResetPasscodeSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      return (
        <View style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Reset Passcode Success" />
          </ImageBackground>
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text="Reset completed!" />
          </View>
          <View style={styles.buttonView}>
            <Button
              text="BACK TO SETTING"
              onPress={async () => {
                const { navigation } = this.props;
                let page = null;
                if (navigation.state.params) {
                  page = navigation.state.params.page;
                }
                if (page && page === 'Transfer') {
                  appContext.eventEmitter.emit('onFirstPasscode');
                  navigation.navigate('Transfer');
                } else {
                  const resetAction = StackActions.reset({
                    index: 1,
                    actions: [
                      NavigationActions.navigate({ routeName: 'MineIndex' }),
                      NavigationActions.navigate({ routeName: 'TwoFactorAuth' }),
                    ],
                  });
                  navigation.dispatch(resetAction);
                }
              }}
            />
          </View>
        </View>
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
