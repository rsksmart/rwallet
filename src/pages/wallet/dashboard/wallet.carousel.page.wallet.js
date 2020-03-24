import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Image, Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import references from '../../../assets/references';
import Loc from '../../../components/common/misc/loc';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import ResponsiveText from '../../../components/common/misc/responsive.text';
import common from '../../../common/common';
import flex from '../../../assets/styles/layout.flex';
import space from '../../../assets/styles/space';

const scan = require('../../../assets/images/icon/scan.png');

const styles = StyleSheet.create({
  addAsset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAssetView: {
    marginTop: 15,
    marginBottom: 50,
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
    flex: 1,
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
    alignItems: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  assetsView: {
    width: '96%',
    alignSelf: 'center',
    flex: 1,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  scanView: {
    marginTop: 0,
    marginRight: 10,
  },
  scan: {
    width: 30,
    height: 30,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const WalletItem = (item) => (
  <TouchableOpacity style={coinListItemStyles.row} onPress={item.onPress}>
    <Image style={coinListItemStyles.icon} source={item.icon} />
    <View style={coinListItemStyles.rowRightView}>
      <View style={coinListItemStyles.rowTitleView}>
        <Text style={coinListItemStyles.title}>{item.title}</Text>
        <Text style={coinListItemStyles.text}>{item.text}</Text>
      </View>
      <View style={coinListItemStyles.rowAmountView}>
        <Text style={coinListItemStyles.worth}>{item.worth}</Text>
        <Text style={coinListItemStyles.amount}>{item.amount}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const WalletPage = (props) => {
  const {
    walletData, onSendPressed, onReceivePressed, onSwapPressed, onAddAssetPressed, onScanQrcodePressed,
    currencySymbol, hasSwappableCoin,
  } = props;
  const { name, coins, assetValue } = walletData;
  const assetValueText = assetValue ? common.getAssetValueString(assetValue) : '';
  const addAssetButton = (
    <View style={styles.addAssetView}>
      <TouchableOpacity style={styles.addAsset} onPress={onAddAssetPressed}>
        <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
        <Loc text="page.wallet.list.addAsset" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={[flex.flex1]}>
      <View style={styles.titleView}>
        <Loc style={styles.headerTitle} text={name} />
        <TouchableOpacity style={styles.scanView} onPress={() => onScanQrcodePressed()}>
          <Image style={[styles.scan]} source={scan} />
        </TouchableOpacity>
      </View>
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
            <TouchableOpacity style={[styles.ButtonView, styles.noBorderRight, { opacity: hasSwappableCoin ? 1 : 0.5 }]} onPress={onSwapPressed} disabled={!hasSwappableCoin}>
              <Image source={references.images.swap} />
              <Loc style={[styles.swapText]} text="button.Swap" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.assetsView}>
        <View style={space.marginTop_30}>
          <Loc style={[styles.assetsTitle]} text="page.wallet.list.allAssets" />
        </View>
        <View style={flex.flex1}>
          <FlatList
            style={flex.flex1}
            data={coins}
            renderItem={({ item }) => WalletItem(item)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={addAssetButton}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

WalletPage.propTypes = {
  walletData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    coins: PropTypes.arrayOf(PropTypes.object),
    assetValue: PropTypes.object,
  }).isRequired,
  onSendPressed: PropTypes.func.isRequired,
  onReceivePressed: PropTypes.func.isRequired,
  onSwapPressed: PropTypes.func.isRequired,
  onAddAssetPressed: PropTypes.func.isRequired,
  onScanQrcodePressed: PropTypes.func.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  hasSwappableCoin: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

export default connect(mapStateToProps)(WalletPage);
