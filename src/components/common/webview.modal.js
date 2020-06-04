import React from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import ProgressWebView from './progress.webview';
import OperationHeader from '../headers/header.operation';

const WebViewModal = ({
  title, url, visible, onBackButtonPress,
}) => (
  <Modal
    animationType="slide"
    visible={visible}
    onRequestClose={onBackButtonPress}
  >
    <View style={{ flex: 1 }}>
      <OperationHeader title={title} onBackButtonPress={onBackButtonPress} />
      <ProgressWebView source={{ uri: url }} />
    </View>
  </Modal>
);

WebViewModal.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  visible: PropTypes.bool,
  onBackButtonPress: PropTypes.func,
};

WebViewModal.defaultProps = {
  url: null,
  title: 'Back',
  visible: false,
  onBackButtonPress: () => null,
};

export default WebViewModal;
