import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BaseModal from './base';
import color from '../../../../assets/styles/color';
import CONSTANTS from '../../../../common/constants.json';

const { WALLET_CONNECT: { MODAL_TYPE } } = CONSTANTS;

const styles = StyleSheet.create({
  content: {
    color: color.black,
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: 28,
  },
});

export default function DisconnectModal({
  cancelPress, confirmPress,
}) {
  return (
    <BaseModal
      title="Leave to disconnect?"
      description="Leaving Wallet Connect page will disconnect RWallet from the current connected Dapp. "
      content={<Text style={styles.content}>Are you sure to disconnect?</Text>}
      cancelPress={cancelPress}
      confirmPress={confirmPress}
      modalType={MODAL_TYPE.CONFIRMATION}
    />
  );
}

DisconnectModal.propTypes = {
  cancelPress: PropTypes.func.isRequired,
  confirmPress: PropTypes.func.isRequired,
};
