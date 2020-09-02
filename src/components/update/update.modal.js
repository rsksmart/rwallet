import React, { Component } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Linking, StyleSheet, BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import space from '../../assets/styles/space';
import notificationStyles from '../../assets/styles/notification.styles';
import color from '../../assets/styles/color';
import Loc from '../common/misc/loc';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  button: {
    width: '50%',
  },
  buttonText: {
    color: color.app.theme,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 11,
    fontFamily: 'Avenir-Heavy',
  },
  buttonLeftLine: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: color.gainsboro,
  },
});

class UpdateModal extends Component {
  onUpdateButtonPressed = () => {
    const { updateVersionInfo } = this.props;
    const { url } = updateVersionInfo;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        console.warn(`Can't handle url: ${url}`);
        return null;
      })
      .catch((err) => console.error('An error occurred', err));
  }

  onCancelButtonPressed = () => {
    const { onUpdateModalClose } = this.props;
    onUpdateModalClose();
  }

  onRequestClose = () => {
    const { updateVersionInfo } = this.props;
    const { forceUpdate } = updateVersionInfo;
    if (!forceUpdate) {
      this.onCancelButtonPressed();
    } else {
      BackHandler.exitApp();
    }
  }

  renderButtons = () => {
    const { updateVersionInfo } = this.props;
    const { forceUpdate } = updateVersionInfo;
    let buttons = null;
    if (forceUpdate) {
      buttons = (
        <TouchableOpacity onPress={this.onUpdateButtonPressed}>
          <Loc style={[styles.buttonText]} text="button.update" />
        </TouchableOpacity>
      );
    } else {
      buttons = (
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={this.onCancelButtonPressed}>
            <Loc style={[styles.buttonText]} text="button.cancel" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonLeftLine]} onPress={this.onUpdateButtonPressed}>
            <Loc style={[styles.buttonText]} text="button.update" />
          </TouchableOpacity>
        </View>
      );
    }
    return buttons;
  }

  render() {
    const { updateVersionInfo } = this.props;
    const { title, body } = updateVersionInfo;
    return (
      <Modal
        transparent
        onRequestClose={this.onRequestClose}
      >
        <View style={notificationStyles.backgroundBoard}>
          <View style={notificationStyles.frontBoard}>
            <View style={space.paddingHorizontal_20}>
              <Text style={[notificationStyles.title]}>{title}</Text>
              <Text style={[notificationStyles.text]}>{body}</Text>
            </View>
            <View style={notificationStyles.line} />
            { this.renderButtons() }
          </View>
        </View>
      </Modal>
    );
  }
}

UpdateModal.propTypes = {
  onUpdateModalClose: PropTypes.func,
  updateVersionInfo: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    url: PropTypes.string,
    forceUpdate: PropTypes.bool,
  }).isRequired,
};

UpdateModal.defaultProps = {
  onUpdateModalClose: () => null,
};

export default UpdateModal;
