import React, { Component } from 'react';
import {
  Modal, View, TouchableOpacity, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loc from '../misc/loc';
import space from '../../../assets/styles/space';
import notificationStyles from '../../../assets/styles/notification.styles';

class Alert extends Component {
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
        <View style={notificationStyles.backgroundBoard}>
          <View style={notificationStyles.frontBoard}>
            <View style={space.paddingHorizontal_20}>
              <Loc style={[notificationStyles.title]} text={title} />
              <Text style={[notificationStyles.text]}>{message}</Text>
            </View>
            <View style={notificationStyles.line} />
            <TouchableOpacity onPress={this.onCloseButtonPress}>
              <Loc style={type === 'error' ? [notificationStyles.button, notificationStyles.errorButtonText] : [notificationStyles.button]} text={closeButtonText} caseType="upper" />
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

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(Alert);
