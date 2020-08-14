import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';

import NewFeatureModalView from './confirmation.modalview.newfeature';

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
    color: color.black,
    marginTop: 6,
  },
  messageStyle: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    color: color.black,
  },
});

const DappWarningConfirmation = ({
  title, message, onCancelPressed, onConfirmPressed,
}) => (
  <View>
    <NewFeatureModalView
      title={title}
      message={message}
      confirmText="page.dapp.button.understood"
      cancelText="page.dapp.button.cancel"
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
      titleStyle={styles.titleStyle}
      messageStyle={styles.messageStyle}
    />
  </View>
);

DappWarningConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
};

DappWarningConfirmation.defaultProps = {
  onConfirmPressed: () => null,
  onCancelPressed: () => null,
};

export default DappWarningConfirmation;
