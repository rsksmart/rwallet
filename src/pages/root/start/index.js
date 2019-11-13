import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import flex from '../../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  startContainer: {

  },
});

export default class Start extends Component {
  async componentDidMount() {
    await this.toPrimatyTab();
  }

  toPrimatyTab = async () => {
    const { navigation } = this.props;
    navigation.navigate('PrimaryTabNavigator');
  }

  render() {
    return (
      <View style={[styles.startContainer, flex.flex1]}>
        <Text>This is the temp start screen</Text>
      </View>
    );
  }
}
Start.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
