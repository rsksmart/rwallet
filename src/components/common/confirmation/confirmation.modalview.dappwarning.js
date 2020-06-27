import React from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import NewFeatureModalView from './confirmation.modalview.newfeature';

const styles = StyleSheet.create({
  closeBtn: {
    marginTop: 34,
    marginLeft: -3,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeImage: {
    width: 12,
    height: 12,
    resizeMode: 'cover',
  },
});

const closeImage = require('../../../assets/images/icon/close.png');

const DappWarningConfirmation = ({
  title, message, onCancelPressed, onConfirmPressed,
}) => (
  <View>
    <TouchableOpacity style={styles.closeBtn} onPress={onCancelPressed}>
      <Image source={closeImage} style={styles.closeImage} />
    </TouchableOpacity>
    <NewFeatureModalView
      title={title}
      message={message}
      confirmText="page.dapp.button.understood"
      cancelText="page.dapp.button.cancel"
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
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
