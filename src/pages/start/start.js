import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import UUIDGenerator from 'react-native-uuid-generator';
import { NavigationActions } from 'react-navigation';

import Button from '../../components/common/button/button';
import Indicator from '../../components/common/misc/indicator';
import ParseHelper from '../../common/parse';
import appContext from '../../common/appContext';
import Application from '../../common/application';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '25%',
  },
  buttonView: {
    position: 'absolute',
    bottom: '10%',
  },
});

export default class StartPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showButton: false,
    };
  }

  async componentDidMount() {
    await Application.init();
    if (!appContext.data.user) {
      this.setState({ showButton: true });
    } else {
      this.setState({ showButton: false, loading: true });
      const { username } = appContext.data.user;
      console.log(`componentDidMount, login, username: ${username}`);
      const user = await ParseHelper.signInOrSignUp(username);
      await appContext.set('user', user);
      appContext.user = user;
      this.setState({ loading: false });
      const { navigation } = this.props;
      const navigateAction = NavigationActions.navigate({
        routeName: 'PrimaryTabNavigator',
      });
      navigation.navigate(navigateAction);
    }
  }

  async login() {
    this.setState({ loading: true });
    const getUsername = () => new Promise((resolve) => {
      UUIDGenerator.getRandomUUID((uuid) => {
        resolve(uuid);
      });
    });
    const username = await getUsername();
    console.log(`login, username: ${username}`);
    const user = await ParseHelper.signInOrSignUp(username);
    await appContext.set('user', user);
    appContext.user = user;
    this.setState({ loading: false });
    console.log(`signInOrSignUp, user: ${JSON.stringify(user)}`);
  }

  render() {
    const { loading, showButton } = this.state;
    const { navigation } = this.props;
    let buttonView = null;
    if (showButton) {
      buttonView = (
        <View style={styles.buttonView}>
          <Button
            text="GET STARTED"
            onPress={async () => {
              this.setState({ showButton: false });
              await this.login();
              navigation.navigate('TermsPage');
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.page}>
        <View style={styles.logo}>
          <Image source={logo} />
          <Indicator visible={loading} style={[{ marginTop: 20 }]} />
        </View>
        {buttonView}
      </View>
    );
  }
}

StartPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
