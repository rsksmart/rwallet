import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import SwitchRow from '../../../components/common/switch/switch.row';
import Loc from '../../../components/common/misc/loc';
import TokenSwitch from '../../../components/common/switch/switch.token';

import { strings } from '../../../common/i18n';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';
import { createInfoNotification } from '../../../common/notification.controller';
import fontFamily from '../../../assets/styles/font.family';
import walletActions from '../../../redux/wallet/actions';

// Get screen width
const SCREEN_WIDTH = Dimensions.get('window').width;

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
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetItem: {
    flexDirection: 'row',
    backgroundColor: color.white,
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    borderRadius: 10,
    width: (SCREEN_WIDTH - 23 * 2) / 2,
  },
  assetIcon: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
  assetSwitch: {
    marginRight: 20,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

class WalletConnecting extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  renderAssetsRow = (assets) => {
    const {
      addToken, deleteToken, wallet, walletManager, updateWallet,
    } = this.props;
    const rowData = [];
    _.forEach(assets, (asset) => {
      if (asset) {
        rowData.push(
          <TokenSwitch
            key={asset.name}
            style={styles.assetItem}
            iconStyle={styles.assetIcon}
            switchStyle={styles.assetSwitch}
            icon={asset.icon}
            name={asset.name}
            value={asset.selected}
            onSwitchValueChanged={(value) => {
              if (value) {
                addToken(walletManager, wallet, asset);
              } else {
                deleteToken(walletManager, wallet, asset);
              }
              updateWallet();
            }}
          />,
        );
      }
    });

    return (
      <View style={styles.assetRow}>
        {rowData}
      </View>
    );
  }

  render() {
    const {
      approve, reject, dappName, address, dappUrl, onSwitchValueChanged, isTestnet, coins,
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
          <Loc style={styles.title} text="page.wallet.walletconnect.assets" />
          <FlatList
            extraData={this.porps}
            data={coins}
            renderItem={({ item }) => this.renderAssetsRow(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={[styles.block, { marginBottom: 160 }]}>
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

          <TouchableOpacity style={[styles.btn, styles.allowBtn]} onPress={approve} disabled={!address}>
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
  coins: PropTypes.array.isRequired,
  isTestnet: PropTypes.bool,
  onSwitchValueChanged: PropTypes.func,
  addToken: PropTypes.func.isRequired,
  deleteToken: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}).isRequired,
  wallet: PropTypes.shape({}).isRequired,
  updateWallet: PropTypes.func.isRequired,
};

WalletConnecting.defaultProps = {
  isTestnet: false,
  onSwitchValueChanged: () => null,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  deleteToken: (walletManager, wallet, token) => dispatch(walletActions.deleteToken(walletManager, wallet, token)),
  addToken: (walletManager, wallet, token) => dispatch(walletActions.addToken(walletManager, wallet, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnecting);
