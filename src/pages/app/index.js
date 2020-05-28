import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';

class AppIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { navigation } = this.props;
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.app.index.title" />}
      >
        <View><Text>12323</Text></View>
      </BasePageGereral>
    );
  }
}

AppIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

export default AppIndex;
