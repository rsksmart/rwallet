import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BaseModal from './base';
import color from '../../../../assets/styles/color';
import CONSTANTS from '../../../../common/constants.json';

const { WALLET_CONNECT: { MODAL_TYPE } } = CONSTANTS;

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  lineTitle: {
    color: color.black,
    fontSize: 15,
    fontFamily: 'Avenir',
  },
  lineValue: {
    color: '#9B9B9B',
    fontSize: 15,
    fontFamily: 'Avenir',
    width: '60%',
    textAlign: 'right',
  },
});

export default function MessageModal({
  message, dappUrl, cancelPress, confirmPress,
}) {
  return (
    <BaseModal
      title="Approve Sign Message"
      description={`By clicking on Confirm, you agree to sign the message originated from ${dappUrl}`}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>Message</Text>
            <Text style={styles.lineValue}>{message}</Text>
          </View>
        </>
        )}
      confirmPress={confirmPress}
      cancelPress={cancelPress}
      modalType={MODAL_TYPE.CONFIRMATION}
    />
  );
}

MessageModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
};
