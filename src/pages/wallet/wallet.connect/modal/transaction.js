import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from '@rsksmart/rsk3';
import BigNumber from 'bignumber.js';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import fontFamily from '../../../../assets/styles/font.family';
import { WALLET_CONNECT } from '../../../../common/constants';
import common from '../../../../common/common';

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
    fontFamily: fontFamily.AvenirBook,
  },
  lineValue: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    width: '60%',
    textAlign: 'right',
  },
});

export default function TransactionModal({
  txData, dappUrl, cancelPress, confirmPress, txType,
}) {
  const {
    value, from, to, data, gasLimit, gasPrice,
  } = txData;
  const stringValue = new BigNumber(value).toString();
  const amount = value ? Rsk3.utils.fromWei(stringValue, 'ether') : '0';
  const gasLimitNumber = new BigNumber(gasLimit);
  const gasPriceNumber = new BigNumber(gasPrice);
  const feeWei = gasLimitNumber.multipliedBy(gasPriceNumber).toString();
  const fee = Rsk3.utils.fromWei(feeWei, 'ether');
  return (
    <BaseModal
      title={strings('page.wallet.walletconnect.approveTransaction')}
      description={strings('page.wallet.walletconnect.approveTransactionDesc', { dappUrl })}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.amount')}</Text>
            <Text style={styles.lineValue}>{`${amount} RBTC`}</Text>
          </View>

          {
              txType && (
                <View style={styles.line}>
                  <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.type')}</Text>
                  <Text style={styles.lineValue}>{txType}</Text>
                </View>
              )
            }

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.from')}</Text>
            <Text style={styles.lineValue}>{common.ellipsisAddress(from, 7)}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.to')}</Text>
            <Text style={styles.lineValue}>{common.ellipsisAddress(to, 7)}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.minerFee')}</Text>
            <Text style={styles.lineValue}>{`${Number(fee).toFixed(6)} RBTC`}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.data')}</Text>
            <Text style={styles.lineValue}>{common.ellipsisString(data, 15)}</Text>
          </View>
        </>
        )}
      confirmPress={confirmPress}
      cancelPress={cancelPress}
      modalType={MODAL_TYPE.CONFIRMATION}
    />
  );
}

TransactionModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  txData: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    data: PropTypes.string,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    gasLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    gasPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  txType: PropTypes.string,
};

TransactionModal.defaultProps = {
  txType: null,
};
