import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import CONSTANTS from '../../../../common/constants.json';

const { WALLET_CONNECT: { MODAL_TYPE } } = CONSTANTS;

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
    fontFamily: 'Avenir',
  },
  lineValue: {
    color: '#9B9B9B',
    fontSize: 15,
    fontFamily: 'Avenir',
  },
});

export default function AllowanceModal({
  dappUrl, cancelPress, asset, fee, confimPress,
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
      confimPress={confimPress}
      cancelPress={cancelPress}
      modalType={MODAL_TYPE.CONFIRMATION}
    />
  );
}

AllowanceModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  confimPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  asset: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
};
