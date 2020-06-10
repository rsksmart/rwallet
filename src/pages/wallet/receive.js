import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import color from '../../assets/styles/color.ts';
// import Input from '../../components/common/input/input';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import common from '../../common/common';
import OperationHeader from '../../components/headers/header.operation';
import BasePageGereral from '../base/base.page.general';
import { strings } from '../../common/i18n';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    letterSpacing: 0.39,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  input: {
    height: 50,
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    marginLeft: -2,
    marginBottom: 2,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  address: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 16,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  addressText: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  refreshIcon: {
    width: 20,
    height: 20,
  },
  qrView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 10,
    alignItems: 'center',
  },
  copyIconView: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const copyIcon = require('../../assets/images/icon/copy.png');
// const refreshIcon = require('../../assets/images/icon/refresh.png');

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
      const qrSize = 270;
      const qrLogoSize = qrSize * 0.2;

      const address = coin && coin.address;
      const symbol = coin && coin.symbol;
      const type = coin && coin.type;
      const subdomain = coin && coin.subdomain;
      const symbolName = common.getSymbolName(symbol, type);
      const qrText = address;
      const title = `${strings('button.Receive')} ${symbolName}`;

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />}
        >
          <View style={styles.body}>
            <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
              <Loc style={[styles.sectionTitle]} text="page.wallet.receive.address" />
              <View style={styles.address}>
                <TouchableOpacity style={styles.copyIconView} onPress={this.onCopyPress}>
                  <Image style={styles.copyIcon} source={copyIcon} />
                </TouchableOpacity>
                <Text style={styles.addressText}>{address}</Text>
                {/* TODO: we hide the refresh icon for now
                Coin should have a isChangable member to decide whether it could generate more addresses
                Only BTC is allowed to do that.
                <TouchableOpacity>
                  <Image style={styles.refreshIcon} source={refreshIcon} />
                </TouchableOpacity> */}
              </View>
              <View style={styles.address}>
                <TouchableOpacity style={styles.copyIconView} onPress={this.onCopySubdomainPressed}>
                  <Image style={styles.copyIcon} source={copyIcon} />
                </TouchableOpacity>
                <Text style={styles.addressText}>{subdomain}</Text>
                {/* TODO: we hide the refresh icon for now
                Coin should have a isChangable member to decide whether it could generate more addresses
                Only BTC is allowed to do that.
                <TouchableOpacity>
                  <Image style={styles.refreshIcon} source={refreshIcon} />
                </TouchableOpacity> */}
              </View>
            </View>
            <View style={[styles.sectionContainer, styles.qrView]}>
              <QRCode
                value={qrText}
                logo={coin.icon}
                logoMargin={5}
                size={qrSize}
                logoSize={qrLogoSize}
              />
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
