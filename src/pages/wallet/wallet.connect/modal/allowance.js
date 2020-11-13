import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import fontFamily from '../../../../assets/styles/font.family';
import { WALLET_CONNECT } from '../../../../common/constants';

const { MODAL_TYPE } = WALLET_CONNECT;

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 36,
  },
  lineTitle: {
    color: color.black,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
  },
  lineValue: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
  },
});

export default function AllowanceModal({
  dappUrl, cancelPress, asset, fee, confirmPress,
}) {
  return (
    <BaseModal
      title={strings('page.wallet.walletconnect.approveAllowance')}
      description={strings('page.wallet.walletconnect.approveAllowanceDesc', { dappUrl })}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('Asset')}</Text>
            <Text style={styles.lineValue}>{asset}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.permission')}</Text>
            <Text style={styles.lineValue}>{strings('page.wallet.walletconnect.allowance')}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.minerFee')}</Text>
            <Text style={styles.lineValue}>{`${fee} RBTC`}</Text>
          </View>
        </>
      )}
      confirmPress={confirmPress}
      cancelPress={cancelPress}
      modalType={MODAL_TYPE.CONFIRMATION}
    />
  );
}

AllowanceModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  asset: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
};
