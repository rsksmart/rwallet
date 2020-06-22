import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Loc from '../misc/loc';
import color from '../../../assets/styles/color.ts';
import space from '../../../assets/styles/space';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Avenir-Black',
    color: color.app.theme,
    fontSize: 20,
  },
  text: {
    fontFamily: 'Avenir-Book',
    color: color.black,
    fontSize: 17,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 15,
  },
  modalView: {
    marginHorizontal: 25,
    backgroundColor: color.white,
    borderRadius: 5,
  },
  confirmButton: {
    width: '75%',
    height: 42,
    backgroundColor: color.app.theme,
    borderRadius: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    color: '#B6B6B6',
    marginBottom: 20,
    marginTop: 10,
  },
  confirmText: {
    color: color.white,
    fontSize: 16,
    fontFamily: 'Avenir-Heavy',
  },
  cancelText: {
    fontFamily: 'Avenir-Roman',
    color: '#B6B6B6',
    fontSize: 16,
  },
  buttonsView: {
    marginTop: 10,
    alignItems: 'center',
  },
});

const NewFeatureModalView = ({
  title, message, onCancelPressed, onConfirmPressed, cancelText, confirmText,
}) => (
  <View style={styles.modalView}>
    <View style={space.paddingHorizontal_25}>
      <View style={styles.titleView}><Loc style={[styles.title]} text={title} /></View>
      <Loc style={[styles.text]} text={message} />
    </View>
    <View style={styles.buttonsView}>
      <TouchableOpacity style={[styles.confirmButton]} onPress={onConfirmPressed}>
        <Loc style={styles.confirmText} text={confirmText} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.cancelButton]} onPress={onCancelPressed}>
        <Loc style={[styles.cancelText]} text={cancelText} />
      </TouchableOpacity>
    </View>
  </View>
);

NewFeatureModalView.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
};

NewFeatureModalView.defaultProps = {
  onConfirmPressed: () => null,
  onCancelPressed: () => null,
};

export default NewFeatureModalView;
