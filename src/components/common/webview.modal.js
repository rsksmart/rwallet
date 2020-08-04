import React, { Component, createRef } from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import ProgressWebView from './progress.webview';
import BrowserHeader from '../headers/header.browser';

class WebViewModal extends Component {
  constructor(props) {
    super(props);
    const { url } = props;
    this.webview = createRef();
    this.state = { isCanGoBack: false, url };
  }

  onNavigationStateChange = (navState) => {
    const { canGoBack, url } = navState;
    this.setState({ isCanGoBack: canGoBack, url });
  }

  onBackButtonPress = () => {
    const { onCloseButtonPress } = this.props;
    const { isCanGoBack } = this.state;
    if (isCanGoBack) {
      this.webview.current.goBack();
    } else {
      onCloseButtonPress();
    }
  }

  render() {
    const {
      visible, onCloseButtonPress,
    } = this.props;
    const { url } = this.state;
    return (
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={onCloseButtonPress}
      >
        <View style={{ flex: 1 }}>
          <BrowserHeader title={url} onBackButtonPress={this.onBackButtonPress} onCloseButtonPress={onCloseButtonPress} />
          <ProgressWebView
            ref={this.webview}
            source={{ uri: url }}
            onNavigationStateChange={this.onNavigationStateChange}
          />
        </View>
      </Modal>
    );
  }
}
WebViewModal.propTypes = {
  url: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onCloseButtonPress: PropTypes.func,
};

WebViewModal.defaultProps = {
  visible: false,
  onCloseButtonPress: () => null,
};

export default WebViewModal;
