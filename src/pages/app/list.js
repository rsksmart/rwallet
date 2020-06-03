import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import BasePageGereral from '../base/base.page.general';
import RSKad from '../../components/common/rsk.ad';
import Header from '../../components/headers/header';

export default class AppList extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { navigation } = this.props;
    const title = navigation.state.params.title || '';
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title={title} />}
      >
        <View><Text>123</Text></View>
      </BasePageGereral>
    );
  }
}

AppList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
