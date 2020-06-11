import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import common from '../../common/common';
import Header from '../../components/headers/header';
import BasePageGereral from '../base/base.page.general';
import { strings } from '../../common/i18n';
import color from '../../assets/styles/color.ts';
import { DEVICE } from '../../common/info';

// const copyIcon = require('../../assets/images/icon/copy.png');
// const refreshIcon = require('../../assets/images/icon/refresh.png');
const QRCODE_SIZE = DEVICE.screenHeight * 0.27;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  addressContainer: {
    marginTop: DEVICE.screenHeight * 0.03,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    width: QRCODE_SIZE + 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subdomainText: {
    color: color.black,
    fontFamily: 'Avenir-Black',
    fontSize: 17,
  },
  addressView: {
    marginTop: DEVICE.screenHeight * 0.01,
  },
  addressText: {
    color: color.black,
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    textAlign: 'center',
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  qrView: {
    marginTop: DEVICE.screenHeight * 0.09,
    alignItems: 'center',
  },
});

class WalletReceive extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.onCopyPress = this.onCopyPress.bind(this);
    }

    onCopyPress() {
      const { navigation, addNotification } = this.props;
      const { coin } = navigation.state.params;
      const address = coin && coin.address;
      if (_.isNil(address)) {
        return;
      }
      Clipboard.setString(address);
      const notification = createInfoNotification(
        'modal.addressCopied.title',
        'modal.addressCopied.body',
      );
      addNotification(notification);
    }

    onSharePressed = () => {
      console.log('onSharePressed');
    }

    onCopySubdomainPressed() {
      const { navigation, addNotification } = this.props;
      const { coin } = navigation.state.params;
      const subdomain = coin && coin.subdomain;
      if (_.isNil(subdomain)) {
        return;
      }
      Clipboard.setString(subdomain);
      const notification = createInfoNotification(
        'modal.addressCopied.title',
        'modal.addressCopied.body',
      );
      addNotification(notification);
    }

    render() {
      const { navigation } = this.props;
      const { coin } = navigation.state.params;

      const address = coin && coin.address;
      const symbol = coin && coin.symbol;
      const type = coin && coin.type;
      let subdomain = coin && coin.subdomain;
      const symbolName = common.getSymbolName(symbol, type);
      const qrText = address;
      const title = `${strings('button.Receive')} ${symbolName}`;

      subdomain = subdomain || 'chris.wallet.rsk';

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn
          bottomBtnText="button.share"
          bottomBtnOnPress={this.onSharePressed}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={navigation.goBack} title={title} />}
        >
          <View style={styles.body}>
            <View style={[styles.qrView]}>
              <QRCode value={qrText} size={QRCODE_SIZE} />
            </View>
            <View style={[styles.addressContainer]}>
              <View style={[styles.address]}>
                <Text style={[styles.subdomainText]}>{subdomain}</Text>
              </View>
              <View style={[styles.address, styles.addressView]}>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

WalletReceive.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletReceive);
