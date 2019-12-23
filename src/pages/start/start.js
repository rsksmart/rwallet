import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';

import { connect } from 'react-redux';
import Button from '../../components/common/button/button';
import Indicator from '../../components/common/misc/indicator';

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
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { isInitWithParseDone, wallets, navigation } = nextProps;
    if (isInitWithParseDone && !isEmpty(wallets)) {
      navigation.navigate('PrimaryTabNavigator');
    }
    return null;
  }

  render() {
    const { loading } = this.state;
    const { navigation, isInitWithParseDone, wallets } = this.props;

    return (
      <View style={styles.page}>
        <View style={styles.logo}>
          <Image source={logo} />
          <Indicator visible={loading} style={[{ marginTop: 20 }]} />
        </View>
        {(isInitWithParseDone && isEmpty(wallets)) && (
        <View style={styles.buttonView}>
          <Button
            text="GET STARTED"
            onPress={async () => {
              navigation.navigate('TermsPage');
            }}
          />
        </View>
        )}
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
