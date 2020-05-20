import React, { Component } from 'react';
import {
  View, ScrollView, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { Switch } from 'native-base';

import flex from '../../../assets/styles/layout.flex';
import MineSettingIndexHeader from './mine.setting.index.header';
import MineSettingIndexItem from './mine.setting.index.item';
import color from '../../src/assets/styles/color.ts';


class Setting extends Component {
    static navigationOptions = () => ({
      headerTitle: 'Settings',
    });

    handleChangeSwitch= async () => {
    };

    render() {
      const { navigation } = this.props;

      return (
        <View style={[flex.flex1]}>
          <ScrollView style={[flex.flex1]}>
            <MineSettingIndexHeader text="System Setting" />
            <MineSettingIndexItem
              navigation={navigation}
              left="Enable Notification"
              right={(
                <Switch
                  trackColor={Platform.OS === 'ios' ? { false: 'gray', true: color.app.theme } : {}}
                  value
                  onValueChange={this.handleChangeSwitch}
                />
              )}
            />
            <MineSettingIndexHeader text="R Wallet" />
            <MineSettingIndexItem
              onPress={() => {
                setTimeout(() => {
                  navigation.navigate('Version');
                }, 0);
              }}
              navigation={navigation}
              left="Version"
            />
            <MineSettingIndexItem
              onPress={() => {
                setTimeout(() => {
                }, 0);
              }}
              navigation={navigation}
              left="Give us feedback"
            />
          </ScrollView>
        </View>
      );
    }
}

export default Setting;

Setting.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
