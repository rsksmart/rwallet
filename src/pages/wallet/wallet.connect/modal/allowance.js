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
      title="Approve Allowance"
      description={`By clicking on Confirm, you agree to allow ${dappUrl} to transfer tokens on your behalf.`}
      content={(
        <>
          <View style={styles.line}>
            <Text style={styles.lineTitle}>Asset</Text>
            <Text style={styles.lineValue}>{asset}</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>Permission</Text>
            <Text style={styles.lineValue}>Allowance</Text>
          </View>

          <View style={styles.line}>
            <Text style={styles.lineTitle}>Miner Fee</Text>
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
