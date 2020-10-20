import React, { Component } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import space from '../../assets/styles/space';
import Loc from '../common/misc/loc';
import config from '../../../config';
import modalStyles from '../../assets/styles/modal.styles';

class ConvertAddressConfirmation extends Component {
  onCancelPressed = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  onConfirmPressed = () => {
    const { onConfirm } = this.props;
    onConfirm();
  }

  onQuestionPressed = () => {
    Linking.openURL(config.accountBasedRskAddressUrl);
  }

  render() {
    const { title, body } = this.props;

    return (
      <Modal transparent onRequestClose={this.onCancelPressed}>
        <View style={modalStyles.container}>
          <View style={modalStyles.panel}>
            <Text style={[modalStyles.title, space.marginTop_35]}>{title}</Text>
            <Text style={[modalStyles.message, space.marginTop_22]}>{body}</Text>
            <TouchableOpacity style={space.marginTop_15} onPress={this.onQuestionPressed}>
              <Loc style={[modalStyles.link]} text="modal.invalidRskAddress.question" />
            </TouchableOpacity>
            <View style={[modalStyles.buttonsView]}>
              <TouchableOpacity style={[modalStyles.recommendButton]} onPress={this.onConfirmPressed}>
                <Loc style={[modalStyles.normalButtonText, modalStyles.recommendButtonText]} text="button.okay" />
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.normalButton, space.marginTop_10]} onPress={this.onCancelPressed}>
                <Loc style={[modalStyles.normalButtonText]} text="button.cancel" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

ConvertAddressConfirmation.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
};

ConvertAddressConfirmation.defaultProps = {
  onConfirm: () => null,
  onCancel: () => null,
  title: null,
  body: null,
};

export default ConvertAddressConfirmation;
