import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import color from '../../assets/styles/color.ts';
// import Input from '../../components/common/input/input';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import ScreenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';

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
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    bottom: 25,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 8,
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
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  addressText: {
    flex: 1,
    marginLeft: 15,
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

});

const header = require('../../assets/images/misc/header.png');
const copyIcon = require('../../assets/images/icon/copy.png');
// const refreshIcon = require('../../assets/images/icon/refresh.png');

class WalletReceive extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      const { navigation, addNotification } = this.props;
      const { coin } = navigation.state.params;
      const logo = navigation.state.params.icon;
      const qrSize = 270;
      const qrLogoSize = qrSize * 0.2;

      const address = coin && coin.address;
      const symbol = coin && coin.symbol;
      const type = coin && coin.type;

      const qrText = address;

      let headerHeight = 100;
      if (DEVICE.isIphoneX) {
        headerHeight += ScreenHelper.iphoneXExtendedHeight;
      }

      const titleText = ` ${symbol} ${type === 'Testnet' ? type : ''}`;

      return (
        <View style={[flex.flex1]}>
          <ImageBackground source={header} style={[{ height: headerHeight }]}>
            <Text style={styles.headerTitle}>
              <Loc text="Receive" />
              {titleText}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.body}>
            <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
              <Loc style={[styles.sectionTitle]} text="Address" />
              <View style={styles.address}>
                <TouchableOpacity onPress={() => {
                  Clipboard.setString(address);
                  const notification = createInfoNotification(
                    'Copied',
                    'The address has been copied to clipboard',
                  );
                  addNotification(notification);
                }}
                >
                  <Image style={styles.copyIcon} source={copyIcon} />
                </TouchableOpacity>
                <Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={1}>{address}</Text>
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
                logo={logo}
                logoMargin={5}
                size={qrSize}
                logoSize={qrLogoSize}
              />
            </View>
          </View>
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

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletReceive);
