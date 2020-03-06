import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, debounce } from 'lodash';

import PropTypes from 'prop-types';
import List from './list';
import AddIndex from './add.index';
import appActions from '../../redux/app/actions';
import timer from '../../common/timer';
import config from '../../../config';

class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { lockApp } = props;
      this.callPasscodeInput = this.callPasscodeInput.bind(this);
      this.willFocusSubscription = null;
      this.lock = debounce(() => lockApp(true), config.appLock.timeout / 2);
    }

    async componentDidMount() {
      const { navigation } = this.props;
      this.willFocusSubscription = navigation.addListener(
        'willFocus',
        () => {
          this.callPasscodeInput();
        },
      );
      this.didBlurSubscription = navigation.addListener(
        'didBlur',
        () => {
          timer.setTimeout(this, 'lockApp', this.lock, config.appLock.timeout);
        },
      );
    }

    componentWillUnmount() {
      this.willFocusSubscription.remove();
      this.didBlurSubscription.remove();
      timer.clearTimeout(this);
    }

    callPasscodeInput() {
      const {
        wallets, showPasscode, appLock, lockApp,
      } = this.props;

      if (!isEmpty(wallets) && appLock) {
        showPasscode('verify', () => lockApp(false));
      }
    }

    render() {
      const { navigation, wallets } = this.props;
      return isEmpty(wallets) ? <AddIndex navigation={navigation} isShowBackButton={false} /> : <List navigation={navigation} />;
    }
}

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  showPasscode: PropTypes.func.isRequired,
  appLock: PropTypes.bool.isRequired,
  lockApp: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  appLock: state.App.get('appLock'),
});

const mapDispatchToProps = (dispatch) => ({
  showPasscode: (category, callback, fallback) => dispatch(
    appActions.showPasscode(category, callback, fallback),
  ),
  lockApp: (lock) => dispatch(
    appActions.lockApp(lock),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
