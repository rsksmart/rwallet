import React from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import ProgressWebView from '../../components/common/progress.webview';
import OperationHeader from '../../components/headers/header.operation';

const WebViewModal = ({ url, visible, onClose }) => (
  <Modal
    animationType="slide"
    visible={visible}
  >
    <View style={{ flex: 1 }}>
      <OperationHeader title="Back" onBackButtonPress={onClose} />
      <ProgressWebView source={{ uri: url }} />
    </View>
  </Modal>
);

WebViewModal.propTypes = {
  url: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

WebViewModal.defaultProps = {
  visible: false,
  onClose: () => null,
};

export default WebViewModal;
