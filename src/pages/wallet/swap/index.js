import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SwapSelection from './swap.selection';
import Swap from './swap';
import config from '../../../../config';

class SwapIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
    };
  }

  componentDidMount() {
    const { navigation, walletManager } = this.props;
    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      () => {
        const wallets = walletManager.getNormalWallets();
        const component = this.getComponent(wallets, navigation);
        this.setState({ component });
      },
    );
    this.didBlurSubscription = navigation.addListener(
      'didBlur',
      () => {
        this.setState({ component: null });
      },
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
    this.didBlurSubscription.remove();
  }

  getComponent = (wallets, navigation) => {
    let hasSwappableCoin = null;

    if (wallets.length === 0) {
      return <SwapSelection navigation={navigation} isShowBackButton={false} />;
    }

    for (let i = 0; i < wallets.length; i += 1) {
      hasSwappableCoin = wallets[i].coins.find((walletCoin) => config.coinswitch.initPairs[walletCoin.id]);
      if (hasSwappableCoin) {
        return <SwapSelection navigation={navigation} isShowBackButton={false} bottomPaddingComponent={<View style={[{ height: 80 }]} />} />;
      }
    }
    return <Swap navigation={navigation} />;
  };

  render() {
    const { component } = this.state;
    return component;
  }
}

SwapIndex.propTypes = {
  walletManager: PropTypes.shape({
    getNormalWallets: PropTypes.func.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

export default connect(mapStateToProps)(SwapIndex);
