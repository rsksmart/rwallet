import React, { Component } from 'react';

import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import OperationHeader from '../../components/headers/header.operation';
import ProgressWebView from '../../components/common/progress.webview';

class Browser extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { navigation } = this.props;
    const url = navigation.state.params.url || '';
    const title = navigation.state.params.title || url;
    return (
      <View style={{ flex: 1 }}>
        <OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />
        <ProgressWebView source={{ uri: url }} />
      </View>
    );
  }
}

Browser.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

export default connect()(Browser);
