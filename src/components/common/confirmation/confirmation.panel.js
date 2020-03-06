import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#9B9B9B',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginTop: 22,
  },
  text: {
    color: '#0B0B0B',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 30,
  },
  line: {
    borderBottomColor: '#DCDCDC',
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  button: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
  errorButtonText: {
    color: '#DF5264',
  },
  ButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ConfirmationPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
    };
    this.onConfirmPress = this.onConfirmPress.bind(this);
    this.onCancelPress = this.onCancelPress.bind(this);
  }

  onConfirmPress() {
    const { onClosePress, confirmationCallback } = this.props;
    onClosePress();
    if (confirmationCallback) {
      confirmationCallback();
    }
  }

  onCancelPress() {
    const { onClosePress, confirmationCancelCallback } = this.props;
    onClosePress();
    if (confirmationCancelCallback) {
      confirmationCancelCallback();
    }
  }

  startShow = () => {
  };

  render() {
    const { animationType, transparent } = this.state;
    const {
      type, title, message, comfirmText, cancelText,
    } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible
        onShow={this.startShow}
      >
        <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ marginHorizontal: 25, backgroundColor: 'white', borderRadius: 5 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <Loc style={[styles.title, type === 'error' ? styles.errorButtonText : null]} text={title} />
              <Loc style={[styles.text]} text={message} />
            </View>
            <View style={styles.line} />
            <View style={styles.ButtonsView}>
              <TouchableOpacity onPress={this.onCancelPress}>
                <Loc style={[styles.button]} text={cancelText} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 70 }} onPress={this.onConfirmPress}>
                <Loc style={[styles.button]} text={comfirmText || 'button.Confirm'} />
              </TouchableOpacity>
            </View>
          </View>
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
  comfirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmationCallback: PropTypes.func,
  confirmationCancelCallback: PropTypes.func,
};

ConfirmationPanel.defaultProps = {
  onClosePress: null,
  confirmationCallback: null,
  confirmationCancelCallback: null,
  comfirmText: 'button.Confirm',
  cancelText: 'button.Cancel',
};
