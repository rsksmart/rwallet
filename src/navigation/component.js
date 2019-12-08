import React from 'react';
import { View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';

import PropTypes from 'prop-types';
import UpdateModal from '../components/update/update.modal';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import Notifications from '../components/common/notification/notifications';
import flex from '../assets/styles/layout.flex';

const SwitchNavi = createAppContainer(createSwitchNavigator(
  {
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
  },
  {
    initialRouteName: 'Start',
  },
));

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';

const RootComponent = (props) => {
  const { showNotification, notification, dispatch } = props;
  return (
    <View style={[flex.flex1]}>
      <Root>
        <SwitchNavi uriPrefix={uriPrefix} />
        {false && <UpdateModal showUpdate mandatory={false} />}
        <Notifications showNotification={showNotification} notification={notification} dispatch={dispatch} />
      </Root>
    </View>
  );
};

RootComponent.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notification: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default RootComponent;
