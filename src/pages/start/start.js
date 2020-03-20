import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image, StyleSheet, Text,
} from 'react-native';
import { isEmpty } from 'lodash';
import DeviceInfo from 'react-native-device-info';

import { connect } from 'react-redux';
import Button from '../../components/common/button/button';
import SafeAreaView from '../../components/common/misc/safe.area.view';
import color from '../../assets/styles/color.ts';
import screenHelper from '../../common/screenHelper';

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
    bottom: screenHelper.bottomButtonMargin,
  },
  versionText: {
    color: color.midGrey,
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '500',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

class StartPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      version: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { isInitWithParseDone, wallets, navigation } = nextProps;
    if (isInitWithParseDone && !isEmpty(wallets)) {
      navigation.navigate('PrimaryTabNavigator');
    }
    return null;
  }

  async componentDidMount() {
    const version = await DeviceInfo.getVersion();
    this.setState({ version });
  }

  render() {
    const { navigation, isInitWithParseDone, wallets } = this.props;
    const { version } = this.state;
    return (
      <SafeAreaView style={[styles.page]}>
        <View style={styles.logo}>
          <Image source={logo} />
        </View>
        {(isInitWithParseDone && isEmpty(wallets)) && (
        <View style={styles.buttonView}>
          <Button text="page.start.start.button" onPress={() => navigation.navigate('TermsPage')} />
        </View>
        )}
        <Text style={styles.versionText}>{`version: ${version}`}</Text>
      </SafeAreaView>
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
  wallets: PropTypes.arrayOf(PropTypes.object),
  isInitWithParseDone: PropTypes.bool.isRequired,
};

StartPage.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  isInitWithParseDone: state.App.get('isInitWithParseDone'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
});

export default connect(mapStateToProps, null)(StartPage);
