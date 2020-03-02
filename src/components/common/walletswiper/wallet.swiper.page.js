import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Image, Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import references from '../../../assets/references';
import Loc from '../misc/loc';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import SwipableButtonList from '../misc/swipableButtonList';
import ResponsiveText from '../misc/responsive.text';
import common from '../../../common/common';

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 0,
  },
  // scan: {
  //   width: 30,
  //   height: 30,
  // },
  addAsset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAssetView: {
    flexDirection: 'row',
  },
  addCircle: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    letterSpacing: 0.39,
    lineHeight: 28,
    marginTop: 0,
    marginLeft: 1,
  },
  headerBoard: {
    width: '100%',
    height: 166,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFF',
  },
  headerBoardView: {
    alignItems: 'center',
    marginTop: 25,
  },
  myAssetsTitle: {
    position: 'absolute',
    top: 25,
    left: 30,
    fontWeight: '500',
    fontSize: 15,
    color: '#000000',
  },
  myAssets: {
    marginTop: 57,
    marginHorizontal: 30,
  },
  myAssetsText: {
    color: '#000000',
    fontFamily: 'Avenir-Black',
    fontSize: 35,
  },
  myAssetsButtonsView: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
  },
  sendText: {
    color: '#6875B7',
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  receiveText: {
    color: '#6FC062',
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  swapText: {
    color: '#656667',
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  assetsTitle: {
    color: '#000000',
    fontSize: 13,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 20,
  },
  spliteLine: {
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    height: 15,
    marginBottom: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  addWalletButtonView: {
    flex: 1,
  },
  addWalletText: {
    color: '#FFF',
    fontFamily: 'Avenir-Medium',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  addWalletButton: {
    backgroundColor: 'rgba(255,255,255, 0.5)',
    borderRadius: 12,
    height: 155,
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const WalletSwiperPage = (props) => {
  const {
    walletData, onSendPressed, onReceivePressed, onSwapPressed, onAddAssetPressed, currencySymbol,
  } = props;
  const { name, coins, assetValue } = walletData;
  const assetValueText = assetValue ? common.getAssetValueString(assetValue) : '';
  return (
    <View>
      <Loc style={styles.headerTitle} text={name} />
      <View style={styles.headerBoardView}>
        <View style={styles.headerBoard}>
          <Text style={styles.myAssetsTitle}>
            <Loc text="page.wallet.list.myAssets" />
            {` (${currencySymbol})`}
          </Text>
          <ResponsiveText layoutStyle={styles.myAssets} fontStyle={styles.myAssetsText} maxFontSize={35}>{assetValueText}</ResponsiveText>
          <View style={styles.myAssetsButtonsView}>
            <TouchableOpacity style={styles.ButtonView} onPress={onSendPressed}>
              <Image source={references.images.send} />
              <Loc style={[styles.sendText]} text="button.Send" />
            </TouchableOpacity>
            <View style={styles.spliteLine} />
            <TouchableOpacity style={styles.ButtonView} onPress={onReceivePressed}>
              <Image source={references.images.receive} />
              <Loc style={[styles.receiveText]} text="button.Receive" />
            </TouchableOpacity>
            <View style={styles.spliteLine} />
            <TouchableOpacity style={[styles.ButtonView, { borderRightWidth: 0 }]} onPress={onSwapPressed}>
              <Image source={references.images.swap} />
              <Loc style={[styles.swapText]} text="button.Swap" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ width: '96%', alignSelf: 'center' }}>
        <View style={[styles.sectionContainer, { marginTop: 30 }]}>
          <Loc style={[styles.assetsTitle]} text="page.wallet.list.allAssets" />
        </View>
        <View style={styles.sectionContainer}>
          <View style={coinListItemStyles.itemView}>
            <SwipableButtonList data={coins} />
          </View>
        </View>
        <View style={[styles.sectionContainer, styles.addAssetView]}>
          <TouchableOpacity style={styles.addAsset} onPress={onAddAssetPressed}>
            <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
            <Loc text="page.wallet.list.addAsset" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

WalletSwiperPage.propTypes = {
  walletData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    coins: PropTypes.arrayOf(PropTypes.object),
    assetValue: PropTypes.object,
  }).isRequired,
  onSendPressed: PropTypes.func.isRequired,
  onReceivePressed: PropTypes.func.isRequired,
  onSwapPressed: PropTypes.func.isRequired,
  onAddAssetPressed: PropTypes.func.isRequired,
  currencySymbol: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

export default connect(mapStateToProps)(WalletSwiperPage);
