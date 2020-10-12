import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Clipboard, Image, TouchableOpacity,
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
import color from '../../assets/styles/color';
import { DEVICE } from '../../common/info';
import references from '../../assets/references';

const QRCODE_SIZE = DEVICE.screenHeight * 0.22;
const DELAY_CAPTURE = 200;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: color.white,
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
    alignItems: 'center',
    marginLeft: 18,
  },
  subdomainText: {
    fontFamily: 'Avenir-Black',
    fontSize: 17,
  },
  addressView: {
    marginTop: DEVICE.screenHeight * 0.01,
  },
  addressText: {
    color: color.app.theme,
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  qrView: {
    marginTop: DEVICE.screenHeight * 0.09,
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: 5,
    marginBottom: 2,
  },
  captureView: {
    flex: 1,
    backgroundColor: color.white,
  },
});

class WalletReceive extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onCopyAddressPressed = () => {
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

    onCopySubdomainPressed = () => {
      const { navigation, addNotification } = this.props;
      const { coin } = navigation.state.params;
      const subdomain = coin && coin.subdomain;
      if (_.isNil(subdomain)) {
        return;
      }
      Clipboard.setString(common.getFullDomain(subdomain));
      const notification = createInfoNotification(
        'modal.subdomainCopied.title',
        'modal.subdomainCopied.body',
      );
      addNotification(notification);
    }

    onSharePressed = () => {
      // In order for the button to rebound first and then take a screenshot, delay the screenshot action。
      // It will not affect the normal execution logic
      setTimeout(async () => {
        const { navigation } = this.props;
        const { coin } = navigation.state.params;
        const message = coin && coin.address;

        const imageBase64Data = await captureRef(this.page, {
          format: 'jpg',
          quality: 0.8,
          result: 'data-uri',
        });

        const shareOptions = {
          message,
          url: imageBase64Data,
          failOnCancel: false,
        };
        Share.open(shareOptions);
      }, DELAY_CAPTURE);
    }

    render() {
      const { navigation } = this.props;
      const { coin } = navigation.state.params;

      const address = coin && coin.address;
      const symbol = coin && coin.symbol;
      const type = coin && coin.type;
      const subdomain = coin && coin.subdomain ? common.getFullDomain(coin.subdomain) : null;
      const symbolName = common.getSymbolName(symbol, type);
      const qrText = address;
      const title = `${strings('button.Receive')} ${symbolName}`;
      return (
        // react-native-view-shot a view ref with the property collapsable = false.
        <View style={styles.captureView} collapsable={false} ref={(ref) => { this.page = ref; }}>
          <BasePageGereral
            collapsable={false}
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
                <TouchableOpacity style={[styles.address]} onPress={this.onCopySubdomainPressed}>
                  <Text style={[styles.addressText, styles.subdomainText]}>{subdomain}</Text>
                  <Image style={styles.copyIcon} source={references.images.copyIcon} />
                </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.address, styles.addressView]} onPress={this.onCopyAddressPressed}>
                  <Text style={styles.addressText}>{address}</Text>
                  <Image style={styles.copyIcon} source={references.images.copyIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </BasePageGereral>
        </View>
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
