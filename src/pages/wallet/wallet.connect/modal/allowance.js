import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { strings } from '../../../../common/i18n';
import BaseModal from './base';
import color from '../../../../assets/styles/color';
import fontFamily from '../../../../assets/styles/font.family';
import { WALLET_CONNECT } from '../../../../common/constants';
import common from '../../../../common/common';
import config from '../../../../../config';

const { MODAL_TYPE } = WALLET_CONNECT;

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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

export default class AllowanceModal extends Component {
  onToAddressPressed = () => {
    const { network, contract } = this.props;
    const url = common.getAddressUrl(network, contract);
    Linking.openURL(url);
  }

  render() {
    const {
      dappUrl, cancelPress, abiInputData, fee, confirmPress, contract,
    } = this.props;
    return (
      <BaseModal
        title={strings('page.wallet.walletconnect.approveAllowance')}
        description={strings('page.wallet.walletconnect.approveAllowanceDesc', { dappUrl })}
        content={(
          <>
            {
              _.map(abiInputData, (value, key) => (
                <View style={styles.line} key={key}>
                  <Text style={styles.lineTitle}>{strings(key)}</Text>
                  <Text style={styles.lineValue}>
                    {value}
                  </Text>
                </View>
              ))
            }

            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.contract')}</Text>
              <TouchableOpacity style={styles.toAddressLink} onPress={this.onToAddressPressed}>
                <Text style={[styles.lineValue, styles.addressLineValue]}>{contract}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.line}>
              <Text style={styles.lineTitle}>{strings('page.wallet.walletconnect.permission')}</Text>
              <Text style={styles.lineValue}>{strings('page.wallet.walletconnect.allowance')}</Text>
            </View>

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

AllowanceModal.propTypes = {
  dappUrl: PropTypes.string.isRequired,
  confirmPress: PropTypes.func.isRequired,
  cancelPress: PropTypes.func.isRequired,
  abiInputData: PropTypes.shape({}),
  fee: PropTypes.string.isRequired,
  contract: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
};

AllowanceModal.defaultProps = {
  abiInputData: null,
};
