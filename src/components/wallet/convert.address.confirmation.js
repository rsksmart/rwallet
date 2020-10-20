import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Text, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import space from '../../assets/styles/space';
import Loc from '../common/misc/loc';
import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blackA50,
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: color.white,
    borderRadius: 5,
    marginHorizontal: 25,
    maxHeight: '82%',
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    color: color.black,
    fontFamily: fontFamily.AvenirHeavy,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: color.black,
    fontFamily: fontFamily.AvenirBook,
  },
  link: {
    fontSize: 14,
    color: color.app.theme,
    fontFamily: fontFamily.AvenirBook,
  },
  recommendButton: {
    justifyContent: 'center',
    height: 45,
    backgroundColor: color.app.theme,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  normalButton: {
    justifyContent: 'center',
    height: 45,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    borderColor: color.vividBlue,
    borderWidth: 1,
  },
  recommendButtonText: {
    color: color.concrete,
  },
  normalButtonText: {
    fontFamily: fontFamily.AvenirHeavy,
    color: color.vividBlue,
    fontSize: 16,
  },
  buttonsView: {
    marginTop: 23,
    alignItems: 'center',
  },
});

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
        <View style={styles.container}>
          <View style={styles.panel}>
            <Text style={[styles.title, space.marginTop_35]}>{title}</Text>
            <Text style={[styles.message, space.marginTop_22]}>{body}</Text>
            <TouchableOpacity style={space.marginTop_15} onPress={this.onQuestionPressed}>
              <Loc style={[styles.link]} text="modal.invalidRskAddress.question" />
            </TouchableOpacity>
            <View style={[styles.buttonsView]}>
              <TouchableOpacity style={[styles.recommendButton]} onPress={this.onConfirmPressed}>
                <Loc style={[styles.normalButtonText, styles.recommendButtonText]} text="button.okay" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.normalButton, space.marginTop_10]} onPress={this.onCancelPressed}>
                <Loc style={[styles.normalButtonText]} text="button.cancel" />
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
