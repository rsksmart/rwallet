import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import { WALLET_CONNECT } from '../../../../common/constants';

const { MODAL_TYPE } = WALLET_CONNECT;

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
    color: color.dustyGray,
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
      title={strings('page.wallet.walletconnect.approveMessage')}
      description={strings('page.wallet.walletconnect.approveMessageDesc', { dappUrl })}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.message')}</Text>
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
