import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Clipboard, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import common from '../../common/common';
import Header from '../../components/headers/header';
import BasePageGereral from '../base/base.page.general';
import { strings } from '../../common/i18n';
import color from '../../assets/styles/color.ts';
import { DEVICE } from '../../common/info';
import config from '../../../config';

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

    onSharePressed = async () => {
      console.log('onSharePressed');

      const uri = await captureRef(this, {
        format: 'jpg',
        quality: 0.8,
        result: 'tmpfile',
      });

      const url = uri;
      const title = 'Awesome Contents';
      const message = 'Please check this out.';
      // eslint-disable-next-line max-len
      const icon = 'data:image/png;base64,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';
      const options = Platform.select({
        ios: {
          activityItemSources: [
            { // For sharing url with custom title.
              placeholderItem: { type: 'url', content: url },
              item: {
                default: { type: 'url', content: url },
              },
              subject: {
                default: title,
              },
              linkMetadata: { originalUrl: url, url, title },
            },
            { // For sharing text.
              placeholderItem: { type: 'text', content: message },
              item: {
                default: { type: 'text', content: message },
                message: null, // Specify no text to share via Messages app.
              },
              linkMetadata: { // For showing app icon on share preview.
                title: message,
              },
            },
            { // For using custom icon instead of default text icon at share preview when sharing with message.
              placeholderItem: {
                type: 'url',
                content: icon,
              },
              item: {
                default: {
                  type: 'text',
                  content: `${message} ${url}`,
                },
              },
              linkMetadata: {
                title: message,
                icon,
              },
            },
          ],
        },
        default: {
          title,
          subject: title,
          message: `${message} ${url}`,
        },
      });

      Share.open(options);
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
      const subdomain = coin && coin.subdomain ? `${coin.subdomain}.${config.rnsDomain}` : null;
      const symbolName = common.getSymbolName(symbol, type);
      const qrText = address;
      const title = `${strings('button.Receive')} ${symbolName}`;
      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn
          bottomBtnText="button.share"
          bottomBtnOnPress={this.onSharePressed}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => { navigation.goBack(); }} title={title} />}
        >
          <View style={styles.body}>
            <View style={[styles.qrView]}>
              <QRCode value={qrText} size={QRCODE_SIZE} />
            </View>
            <View style={[styles.addressContainer]}>
              {subdomain && (
                <View style={[styles.address]}>
                  <Text style={[styles.subdomainText]}>{subdomain}</Text>
                </View>
              )}
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
