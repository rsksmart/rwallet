import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Loc from '../misc/loc';
import color from '../../../assets/styles/color.ts';

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
    color: color.app.theme,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
  errorButtonText: {
    color: color.warningText,
  },
});

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
    };
    this.onCloseButtonPress = this.onCloseButtonPress.bind(this);
  }

  onCloseButtonPress() {
    const { onClosePress, notificationCloseCallback } = this.props;
    onClosePress();
    if (notificationCloseCallback) {
      notificationCloseCallback();
    }
  }

  startShow = () => {
  };

  render() {
    const { animationType, transparent } = this.state;
    const {
      title, message, buttonText, type,
    } = this.props;
    const closeButtonText = buttonText || 'button.gotIt';
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
              <Loc style={[styles.title]} text={title} />
              <Loc style={[styles.text]} text={message} />
            </View>
            <View style={styles.line} />
            <TouchableOpacity onPress={this.onCloseButtonPress}>
              <Loc style={type === 'error' ? [styles.button, styles.errorButtonText] : [styles.button]} text={closeButtonText} caseType="upper" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  onClosePress: PropTypes.func,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  type: PropTypes.string.isRequired,
  notificationCloseCallback: PropTypes.func,
};

Alert.defaultProps = {
  onClosePress: null,
  buttonText: null,
  notificationCloseCallback: null,
};
