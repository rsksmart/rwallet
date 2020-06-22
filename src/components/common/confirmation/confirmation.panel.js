import React, { Component } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import NewFeatureModalView from './confirmation.modalview.newfeature';
import DefaultModalView from './confirmation.modalview.default';

const styles = StyleSheet.create({
  modalViewWrapper: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default class ConfirmationPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
    };
  }

  onConfirmPressed = () => {
    const { onClosePress, confirmationCallback } = this.props;
    onClosePress();
    if (confirmationCallback) {
      confirmationCallback();
    }
  }

  onCancelPressed = () => {
    const { onClosePress, confirmationCancelCallback } = this.props;
    onClosePress();
    if (confirmationCancelCallback) {
      confirmationCancelCallback();
    }
  }

  render() {
    const { animationType, transparent } = this.state;
    const {
      type, title, message, confirmText, cancelText,
    } = this.props;
    const ModalView = type === 'newFeature' ? NewFeatureModalView : DefaultModalView;

    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible
      >
        <View style={styles.modalViewWrapper}>
          <ModalView
            title={title}
            message={message}
            confirmText={confirmText || 'button.confirm'}
            cancelText={cancelText}
            onCancelPressed={this.onCancelPressed}
            onConfirmPressed={this.onConfirmPressed}
          />
        </View>
      </Modal>
    );
  }
}

ConfirmationPanel.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClosePress: PropTypes.func,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmationCallback: PropTypes.func,
  confirmationCancelCallback: PropTypes.func,
};

ConfirmationPanel.defaultProps = {
  onClosePress: null,
  confirmationCallback: null,
  confirmationCancelCallback: null,
  confirmText: 'button.confirm',
  cancelText: 'button.cancel',
};
