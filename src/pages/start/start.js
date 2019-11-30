import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import Button from '../../components/common/button/button';
import Indicator from '../../components/common/misc/indicator';
import appContext from '../../common/appContext';
import appActions from '../../redux/app/actions';

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

class StartPage extends Component {
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

  componentWillMount() {
    const { initApp } = this.props;

    // Load Settings and Wallets from permenate storage
    initApp();
  }

  async componentDidMount() {
    // await Application.init();
    if (!appContext.data.user) {
      this.setState({ showButton: true });
    } else {
      this.setState({ showButton: false, loading: true });

      // const { username } = appContext.data.user;
      // console.log(`componentDidMount, login, username: ${username}`);
      // const user = await ParseHelper.signInOrSignUp(username);
      // await appContext.set('user', user);
      // appContext.user = user;
      this.setState({ loading: false });
      const { navigation } = this.props;
      navigation.navigate('PrimaryTabNavigator');
    }
  }

  async login() {
    this.setState({ loading: true });
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
              // await this.login();
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
  initApp: PropTypes.func.isRequired,
};

StartPage.defaultProps = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  initApp: () => dispatch(appActions.initApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPage);
