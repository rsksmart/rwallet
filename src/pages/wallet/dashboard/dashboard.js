import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, debounce } from 'lodash';

import PropTypes from 'prop-types';
import List from './list';
import AddIndex from './add.index';
import appActions from '../../../redux/app/actions';
import timer from '../../../common/timer';
import config from '../../../../config';
import fcmHelper from '../../../common/fcmHelper';

class Dashboard extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { lockApp } = props;
      this.willFocusSubscription = null;
      this.lock = debounce(() => lockApp(true), config.appLock.timeout / 2);
    }

    async componentWillMount() {
      const { processNotification } = this.props;
      const notification = await fcmHelper.getInitialNotification();
      processNotification(notification);
    }

    componentDidMount() {
      const { navigation } = this.props;
      this.willFocusSubscription = navigation.addListener('willFocus', this.doAuthVerify);
      this.didBlurSubscription = navigation.addListener(
        'didBlur',
        () => {
          timer.setTimeout(this, 'lockApp', this.lock, config.appLock.timeout);
        },
      );
    }

    componentWillReceiveProps(nextProps) {
      const {
        fcmNavParams, appLock, isLoginError, showInAppNotification, resetLoginError,
      } = nextProps;
      const { isLoginError: lastIsLoginError } = this.props;
      if (!appLock) {
        this.callFcmNavigate(fcmNavParams);
      }
      if (!lastIsLoginError && isLoginError) {
        showInAppNotification({ title: 'Network Error', body: 'Your device can not connect to the server.' });
        resetLoginError();
      }
    }

    componentWillUnmount() {
      this.willFocusSubscription.remove();
      this.didBlurSubscription.remove();
      timer.clearTimeout(this);
    }

    /**
     * callFcmNavigate
     * If fcmNavParams is exsisted, navigate to the proper page.
     */
    callFcmNavigate = (fcmNavParams) => {
      const { resetFcmNavParams, navigation } = this.props;
      if (fcmNavParams) {
        const { routeName, routeParams } = fcmNavParams;
        navigation.push(routeName, routeParams);
        resetFcmNavParams();
      }
    }

    doAuthVerify = () => {
      const {
        wallets, appLock, lockApp, fcmNavParams, callAuthVerify,
      } = this.props;
      if (!isEmpty(wallets) && appLock) {
        callAuthVerify(() => {
          lockApp(false);
          this.callFcmNavigate(fcmNavParams);
        });
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
    push: PropTypes.func.isRequired,
  }).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  appLock: PropTypes.bool.isRequired,
  lockApp: PropTypes.func.isRequired,
  processNotification: PropTypes.func.isRequired,
  fcmNavParams: PropTypes.shape({
    routeName: PropTypes.string.isRequired,
    routeParams: PropTypes.object,
  }),
  resetFcmNavParams: PropTypes.func.isRequired,
  callAuthVerify: PropTypes.func.isRequired,
  isLoginError: PropTypes.bool.isRequired,
  showInAppNotification: PropTypes.func.isRequired,
  resetLoginError: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  wallets: undefined,
  fcmNavParams: undefined,
};

const mapStateToProps = (state) => ({
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  appLock: state.App.get('appLock'),
  fcmNavParams: state.App.get('fcmNavParams'),
  isLoginError: state.App.get('isLoginError'),
});

const mapDispatchToProps = (dispatch) => ({
  showPasscode: (category, callback, fallback) => dispatch(
    appActions.showPasscode(category, callback, fallback),
  ),
  lockApp: (lock) => dispatch(
    appActions.lockApp(lock),
  ),
  processNotification: (notification) => dispatch(appActions.processNotification(notification)),
  resetFcmNavParams: () => dispatch(appActions.resetFcmNavParams()),
  callAuthVerify: (callback, fallback) => dispatch(appActions.callAuthVerify(callback, fallback)),
  showInAppNotification: (inAppNotification) => dispatch(appActions.showInAppNotification(inAppNotification)),
  resetLoginError: () => dispatch(appActions.resetLoginError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
