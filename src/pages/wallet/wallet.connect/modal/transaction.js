import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from '@rsksmart/rsk3';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import fontFamily from '../../../../assets/styles/font.family';
import { WALLET_CONNECT, DEFAULT_FIXED_DIGITS } from '../../../../common/constants';
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
  toAddressLink: {
    width: '60%',
    alignSelf: 'flex-end',
  },
  addressLineValue: {
    width: '100%',
    color: color.app.theme,
    fontSize: 13,
  },
});

export default class TransactionModal extends Component {
  onToAddressPressed = (toAddress) => {
    const { txData } = this.props;
    const { network } = txData;
    const url = common.getAddressUrl(network, toAddress);
    Linking.openURL(url);
  }

  getAbiInputView = (abiInputData) => {
    const abiInputView = [];
    _.forEach(abiInputData, (inputValue, key) => {
      abiInputView.push(
        <View style={styles.line} key={key}>
          <Text style={styles.lineTitle}>{strings(`page.wallet.walletconnect.${key}`)}</Text>
          {
            (key === 'To' || key === 'Recipient') ? (
              <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(inputValue)}>
                <Text style={[styles.lineValue, styles.addressLineValue]}>{inputValue}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lineValue}>{inputValue}</Text>
            )
          }
        </View>,
      );
    });

    return abiInputView;
  }

  render() {
    const {
      txData, dappUrl, cancelPress, confirmPress, txType, abiInputData,
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
            {
              txType && (
                <View style={styles.line}>
                  <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.type')}</Text>
                  <Text style={styles.lineValue}>{txType}</Text>
                </View>
              )
            }

            {
              // If abiInputData is empty, display the normal transaction info
              // otherwise display contract abi info
              _.isEmpty(abiInputData) ? (
                <>
                  <View style={styles.line}>
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.amount')}</Text>
                    <Text style={styles.lineValue}>{`${amount} RBTC`}</Text>
                  </View>
                  <View style={styles.line}>
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.from')}</Text>
                    <Text style={styles.lineValue}>{common.ellipsisAddress(from, 7)}</Text>
                  </View>
                  <View style={styles.line}>
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.to')}</Text>
                    <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(to)}>
                      <Text style={[styles.lineValue, styles.addressLineValue]}>{to}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  {
                    _.isEmpty(abiInputData.From) && (
                      <View style={styles.line}>
                        <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.from')}</Text>
                        <Text style={styles.lineValue}>{common.ellipsisAddress(from, 7)}</Text>
                      </View>
                    )
                  }
                  { this.getAbiInputView(abiInputData) }
                  <View style={styles.line}>
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.contract')}</Text>
                    <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(to)}>
                      <Text style={[styles.lineValue, styles.addressLineValue]}>{to}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            }

            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.minerFee')}</Text>
              <Text style={styles.lineValue}>{`${Number(fee).toFixed(DEFAULT_FIXED_DIGITS)} RBTC`}</Text>
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
  abiInputData: PropTypes.shape({
    From: PropTypes.string,
  }),
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  txType: PropTypes.string,
};

TransactionModal.defaultProps = {
  txType: null,
  abiInputData: null,
};
