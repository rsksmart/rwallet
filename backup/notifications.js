import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import Item from './notifications.item';

export default class Notifications extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  listData = [
    {
      title: 'Enable push notifications',
      selected: false,
    },
    {
      title: 'Notify me when transactions are confirmed',
      selected: false,
    },
    {
      title: 'Enable email notifications',
      selected: false,
    },
  ];

  render() {
    const { navigation } = this.props;
    return (
      <View style={[flex.flex1]}>
        <Header title="Notifications" goBack={navigation.goBack} />
        <FlatList
          data={this.listData}
          renderItem={({ item }) => <Item data={item} />}
          keyExtractor={() => `${Math.random()}`}
        />
      </View>
    );
  }
}

Notifications.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
