import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from '@rsksmart/rsk3';
import BigNumber from 'bignumber.js';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import { WALLET_CONNECT } from '../../../../common/constants';
import config from '../../../../../config';
import common from '../../../../common/common';
import styles from '../../../../assets/styles/dapp.popup';

const { MODAL_TYPE } = WALLET_CONNECT;

export default class TransactionModal extends Component {
  onToAddressPressed = (toAddress) => {
    const { txData } = this.props;
    const { network } = txData;
    const url = common.getAddressUrl(network, toAddress);
    Linking.openURL(url);
  }

  render() {
    const {
      txData, dappUrl, cancelPress, confirmPress,
    } = this.props;
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
            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.from')}</Text>
              <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(from)}>
                <Text style={[styles.lineValue, styles.addressLineValue]}>{from}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.to')}</Text>
              <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(to)}>
                <Text style={[styles.lineValue, styles.addressLineValue]}>{to}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.minerFee')}</Text>
              <Text style={styles.lineValue}>{`${Number(fee).toFixed(config.symbolDecimalPlaces.RBTC)} RBTC`}</Text>
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
}

TransactionModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  txData: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    data: PropTypes.string,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    gasLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    gasPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    network: PropTypes.string,
  }).isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
};
