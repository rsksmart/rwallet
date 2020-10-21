import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import SwitchRow from '../../../components/common/switch/switch.row';
import Loc from '../../../components/common/misc/loc';

import { strings } from '../../../common/i18n';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';
import { createInfoNotification } from '../../../common/notification.controller';
import fontFamily from '../../../assets/styles/font.family';

const styles = StyleSheet.create({
  body: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.white,
    marginTop: -(200 + screenHelper.topHeight) / 2 + 23,
    elevation: 1,
    paddingVertical: 30,
    paddingHorizontal: 23,
  },
  block: {
    marginTop: 24,
  },
  dappName: {
    fontSize: 20,
    color: color.black,
    fontWeight: 'bold',
    fontFamily: fontFamily.AvenirHeavy,
  },
  dappUrl: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    marginTop: 6,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
  },
  content: {
    fontFamily: fontFamily.AvenirBook,
    color: color.mineShaft,
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    width: '100%',
    height: 53,
    backgroundColor: color.concrete,
    marginTop: 12,
    shadowColor: color.approxGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  btnsView: {
    position: 'absolute',
    bottom: 40,
    left: 23,
    right: 23,
  },
  btn: {
    width: '100%',
    height: 40,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderColor: color.vividBlue,
    borderWidth: 2,
  },
  rejectText: {
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.vividBlue,
  },
  allowBtn: {
    marginTop: 18,
    backgroundColor: color.vividBlue,
  },
  allowText: {
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.white,
  },
});

class WalletConnecting extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const {
      approve, reject, address, dappName, dappUrl, onSwitchValueChanged, isTestnet,
    } = this.props;

    return (
      <>
        <View>
          <View>
            <Text style={styles.dappName}>{dappName}</Text>
          </View>
          <Text style={styles.dappUrl}>{dappUrl}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>{strings('page.wallet.walletconnect.request')}</Text>
          <Text style={styles.content}>
            {strings('page.wallet.walletconnect.connectWallet', { dappName })}
          </Text>
          <View style={styles.address}>
            <Text style={styles.content}>{address}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>{strings('page.wallet.walletconnect.content')}</Text>
          <Text style={styles.content}>{strings('page.wallet.walletconnect.agreeTo')}</Text>
          <Text style={styles.content}>{strings('page.wallet.walletconnect.agreeOne')}</Text>
          <Text style={styles.content}>{strings('page.wallet.walletconnect.agreeTwo')}</Text>
        </View>

        <View style={styles.block}>
          <Loc style={styles.title} text="page.wallet.walletconnect.advancedOptions" />
          <SwitchRow
            value={isTestnet}
            text={strings('page.wallet.addCustomToken.testnet')}
            onValueChange={onSwitchValueChanged}
            questionNotification={createInfoNotification(
              'page.wallet.walletconnect.networkQuestion.title',
              'page.wallet.walletconnect.networkQuestion.body',
            )}
          />
        </View>

        <View style={styles.btnsView}>
          <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={reject}>
            <Text style={styles.rejectText}>{strings('page.wallet.walletconnect.reject')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.allowBtn]} onPress={approve}>
            <Text style={styles.allowText}>{strings('page.wallet.walletconnect.allow')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

WalletConnecting.propTypes = {
  approve: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  dappName: PropTypes.string.isRequired,
  dappUrl: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  isTestnet: PropTypes.bool,
  onSwitchValueChanged: PropTypes.func,
};

WalletConnecting.defaultProps = {
  isTestnet: false,
  onSwitchValueChanged: () => null,
};

export default WalletConnecting;
