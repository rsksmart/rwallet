import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import { WALLET_CONNECT } from '../../../../common/constants';
import config from '../../../../../config';
import common from '../../../../common/common';
import styles from '../../../../assets/styles/dapp.popup';

const { MODAL_TYPE } = WALLET_CONNECT;

export default class Contract extends Component {
  onToAddressPressed = (toAddress) => {
    const { txData } = this.props;
    const { network } = txData;
    const url = common.getAddressUrl(network, toAddress);
    Linking.openURL(url);
  }

  getParamsView = (params) => {
    const paramsView = [];
    _.forEach(params, (param, key) => {
      const { type, value } = param;
      paramsView.push(
        <View style={styles.line} key={key}>
          <Text style={styles.lineTitle}>{strings(`page.wallet.walletconnect.${(key && key.toLocaleLowerCase())}`)}</Text>
          {
            (type === 'address') ? (
              <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(value)}>
                <Text style={[styles.lineValue, styles.addressLineValue]}>{value}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lineValue}>{value}</Text>
            )
          }
        </View>,
      );
    });

    return paramsView;
  }

  render() {
    const {
      txData, dappUrl, cancelPress, confirmPress, abiInputData,
    } = this.props;
    const {
      from, to, gasLimit, gasPrice, data,
    } = txData;
    const gasLimitNumber = new BigNumber(gasLimit);
    const gasPriceNumber = new BigNumber(gasPrice);
    const feeWei = gasLimitNumber.multipliedBy(gasPriceNumber).toString();
    const fee = Web3.utils.fromWei(feeWei, 'ether');
    return (
      <BaseModal
        title={strings('page.wallet.walletconnect.approveSmartContract')}
        description={strings('page.wallet.walletconnect.approveSmartContractDesc', { dappUrl })}
        content={(
          <>
            {
              _.isEmpty(abiInputData) ? (
                <>
                  <View style={styles.line}>
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.contract')}</Text>
                    <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(to)}>
                      <Text style={[styles.lineValue, styles.addressLineValue]}>{to}</Text>
                    </TouchableOpacity>
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
                    <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.data')}</Text>
                    <Text style={styles.lineValue}>{common.ellipsisString(data, 15)}</Text>
                  </View>
                </>
              ) : (
                <>
                  {
                    _.isEmpty(abiInputData.params.Contract) && (
                      <View style={styles.line}>
                        <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.contract')}</Text>
                        <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(to)}>
                          <Text style={[styles.lineValue, styles.addressLineValue]}>{to}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  {
                    abiInputData.method !== null && (
                      <View style={styles.line}>
                        <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.method')}</Text>
                        <Text style={styles.lineValue}>{abiInputData.method}</Text>
                      </View>
                    )
                  }
                  {
                    _.isEmpty(abiInputData.params.From) && (
                      <View style={styles.line}>
                        <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.from')}</Text>
                        <TouchableOpacity style={styles.toAddressLink} onPress={() => this.onToAddressPressed(from)}>
                          <Text style={[styles.lineValue, styles.addressLineValue]}>{from}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  }
                  {this.getParamsView(abiInputData.params)}
                </>
              )
            }

            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.minerFee')}</Text>
              <Text style={styles.lineValue}>{`${Number(fee).toFixed(config.symbolDecimalPlaces.RBTC)} RBTC`}</Text>
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

Contract.propTypes = {
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
    method: PropTypes.string,
    params: {
      From: PropTypes.string,
      Contract: PropTypes.string,
    },
  }),
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
};

Contract.defaultProps = {
  abiInputData: null,
};
