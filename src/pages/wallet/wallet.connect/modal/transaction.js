import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from '@rsksmart/rsk3';

import BaseModal from './base';
import color from '../../../../assets/styles/color';
import CONSTANTS from '../../../../common/constants.json';
import common from '../../../../common/common';

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

export default function TransactionModal({
  txData, dappUrl, cancelPress, confirmPress, txType,
}) {
  const {
    value, from, to, data, gasLimit, gasPrice,
  } = txData;
  const amount = Rsk3.utils.hexToNumber(value);
  const gasLimitNumber = Rsk3.utils.hexToNumber(gasLimit);
  const gasPriceNumber = Rsk3.utils.hexToNumber(gasPrice);
  const feeWei = gasLimitNumber * gasPriceNumber;
  const fee = Rsk3.utils.fromWei(String(feeWei), 'ether');
  return (
    <BaseModal
      title="Approve Transaction"
      description={`By clicking on Confirm, you agree to sign the transaction originated from ${dappUrl}`}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>Amount</Text>
            <Text style={styles.lineValue}>{`${amount} RBTC`}</Text>
          </View>

          {
              txType && (
                <View style={styles.line}>
                  <Text style={styles.lineTitle}>Type</Text>
                  <Text style={styles.lineValue}>{txType}</Text>
                </View>
              )
            }

          <View style={styles.line}>
            <Text style={styles.lineTitle}>From</Text>
            <Text style={styles.lineValue}>{common.ellipsisString(from, 7)}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>To</Text>
            <Text style={styles.lineValue}>{common.ellipsisString(to, 7)}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>Miner Fee</Text>
            <Text style={styles.lineValue}>{`${fee} RBTC`}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>Data</Text>
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
    value: PropTypes.string.isRequired,
    data: PropTypes.string,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    gasLimit: PropTypes.string.isRequired,
    gasPrice: PropTypes.string.isRequired,
  }).isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  txType: PropTypes.string,
};

TransactionModal.defaultProps = {
  txType: null,
};
