import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
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
    TermsPage: {
      screen: TermsPage,
      path: 'terms',
    },
    PrimaryTabNavigator: {
      screen: PrimaryTabNavigatorComp,
      path: 'tab',
    },
  },
  {
    initialRouteName: 'Start',
  },
));

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';

const styles = StyleSheet.create({
  notificationsContainer: {
    position: 'absolute',
    bottom: 70,
    left: 10,
  },
});

const RootComponent = (props) => {
  const { notifications } = props;
  return (
    <View style={[flex.flex1]}>
      <Root>
        <SwitchNavi uriPrefix={uriPrefix} />
        {false && <UpdateModal showUpdate mandatory={false} />}
        <View style={styles.notificationsContainer}>
          <Notifications notifications={notifications} />
        </View>
      </Root>
    </View>
  );
};

RootComponent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default RootComponent;
