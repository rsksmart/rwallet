import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import { WALLET_CONNECT } from '../../../../common/constants';

const { MODAL_TYPE } = WALLET_CONNECT;

const styles = StyleSheet.create({
  content: {
    color: color.black,
    fontSize: 15,
    fontFamily: 'Avenir-Book',
    marginTop: 28,
  },
});

export default function DisconnectModal({
  cancelPress, confirmPress,
}) {
  return (
    <BaseModal
      title={strings('page.wallet.walletconnect.leaveToDisconnect')}
      description={strings('page.wallet.walletconnect.leaveToDisconnectDesc')}
      content={<Text style={styles.content}>{strings('page.wallet.walletconnect.leaveToDisconnectConfirm')}</Text>}
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
