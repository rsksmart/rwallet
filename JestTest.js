import React, { Component } from 'react';

import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class JestTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: 'Jest Test 1',
    };
  }

  render() {
    const { params } = this.props;
    const { content } = this.state;
    return (
      <View params={params}>
        <Text>{content}</Text>
        <Text>Jest Test 2</Text>
        <Text>{params}</Text>
      </View>
    );
  }
}

JestTest.propTypes = {
  params: PropTypes.string.isRequired,
};
