import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import UUIDGenerator from 'react-native-uuid-generator';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';
import ParseHelper from '../../common/parse';

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
    };
  }

  async login() {
    this.setState({ loading: true });
    const getUsername = () => new Promise((resolve) => {
      UUIDGenerator.getRandomUUID((uuid) => {
        resolve(uuid);
      });
    });
    const username = await getUsername();
    const user = await ParseHelper.signInOrSignUp(username);
    this.setState({ loading: false });
    console.log(`signInOrSignUp, user: ${JSON.stringify(user)}`);
  }

  render() {
    const { loading } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.page}>
        <Loader loading={loading} />
        <Image style={styles.logo} source={logo} />
        <View style={styles.buttonView}>
          <Button
            style={styles.button}
            text="GET STARTED"
            onPress={async () => {
              await this.login();
              navigation.navigate('TermsPage');
            }}
          />
        </View>
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
