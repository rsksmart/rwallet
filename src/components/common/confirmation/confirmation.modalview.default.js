import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
  errorButtonText: {
    color: color.warningText,
  },
  ButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const DefaultModalView = ({
  title, message, onCancelPressed, onConfirmPressed, cancelText, confirmText,
}) => (
  <View style={{ marginHorizontal: 25, backgroundColor: 'white', borderRadius: 5 }}>
    <View style={{ paddingHorizontal: 20 }}>
      <Loc style={[styles.title]} text={title} />
      <Loc style={[styles.text]} text={message} />
    </View>
    <View style={styles.line} />
    <View style={styles.ButtonsView}>
      <TouchableOpacity onPress={onCancelPressed}>
        <Loc style={[styles.button]} text={cancelText} caseType="upper" />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginLeft: 70 }} onPress={onConfirmPressed}>
        <Loc style={[styles.button]} text={confirmText} caseType="upper" />
      </TouchableOpacity>
    </View>
  </View>
);

DefaultModalView.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
};

DefaultModalView.defaultProps = {
  onConfirmPressed: () => null,
  onCancelPressed: () => null,
};

export default DefaultModalView;
