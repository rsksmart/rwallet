import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import _ from 'lodash';

import PropTypes from 'prop-types';
import UpdateModal from '../components/update/update.modal';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import Notifications from '../components/common/notification/notifications';
import flex from '../assets/styles/layout.flex';
import Toast from '../components/common/notification/toast';
import appActions from '../redux/app/actions';

const DEFAULT_ROUTE_CONFIG_MAP = {
  Start: {
    screen: Start,
    path: 'start',
  },
  PrimaryTabNavigator: {
    screen: PrimaryTabNavigatorComp,
    path: 'tab',
  },
  TermsPage: {
    screen: TermsPage,
    path: 'terms',
  },
};

const DEFUALT_SWITCH_CONFIG = {
  initialRouteName: 'PrimaryTabNavigator',
};

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';
class RootComponent extends Component {
  constructor(props) {
    super(props);
    global.functions = {
      showToast: (wording) => {
        // eslint-disable-next-line react/no-string-refs
        this.toast.showToast(wording);
      },
    };

    this.state = {
      isInitialized: false,
      SwitchNavComponent: undefined,
    };
  }

  /**
   * RootComponent is the main entrace of the App
   * Initialization jobs need to start here
   */
  componentWillMount() {
    const { initializeFromStorage } = this.props;

    // Load Settings and Wallets from permenate storage
    initializeFromStorage();
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInitFromStorageDone, isInitWithParseDone, initializeWithParse,
    } = nextProps;

    const newState = this.state;

    // As long as the app initialized from storage, we mark state.isInitialized to true
    if (isInitFromStorageDone && !isInitWithParseDone) {
      newState.isInitialized = true;
      newState.SwitchNavComponent = createAppContainer(
        createSwitchNavigator(
          DEFAULT_ROUTE_CONFIG_MAP, _.extend(DEFUALT_SWITCH_CONFIG, { initialRouteName: 'PrimaryTabNavigator' }),
        ),
      );
      initializeWithParse();
    }

    this.setState(newState);
  }

  render() {
    const { showNotification, notification, dispatch } = this.props;
    const { isInitialized, SwitchNavComponent } = this.state;

    return (
      <View style={[flex.flex1]}>
        {isInitialized // TODO: what do we show while waiting for initialized?
        && (
        <Root>
          <SwitchNavComponent uriPrefix={uriPrefix} />
          {false && <UpdateModal showUpdate mandatory={false} />}
          <Notifications showNotification={showNotification} notification={notification} dispatch={dispatch} />
          <Toast ref={(ref) => { this.toast = ref; }} backgroundColor="white" position="top" textColor="green" />
        </Root>
        )}
      </View>
    );
  }
}

RootComponent.propTypes = {
  initializeFromStorage: PropTypes.func.isRequired,
  initializeWithParse: PropTypes.func.isRequired,
  showNotification: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}), // TODO: what is this notification supposed to be?p
  dispatch: PropTypes.func.isRequired,
  isInitFromStorageDone: PropTypes.bool.isRequired,
  isInitWithParseDone: PropTypes.bool.isRequired,
};

RootComponent.defaultProps = {
  notification: null,
};

const mapStateToProps = (state) => ({
  isInitFromStorageDone: state.App.get('isInitFromStorageDone'),
  isInitWithParseDone: state.App.get('isInitWithParseDone'),
});

const mapDispatchToProps = (dispatch) => ({
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);
