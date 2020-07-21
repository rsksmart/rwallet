import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
} from 'rn-placeholder';
import references from '../../../assets/references';
import Loc from '../../../components/common/misc/loc';
import flex from '../../../assets/styles/layout.flex';
import space from '../../../assets/styles/space';
import color from '../../../assets/styles/color';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';

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
    color: color.whiteA90,
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
    borderColor: color.alto,
    borderBottomWidth: 0,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: color.white,
  },
  headerBoardView: {
    alignItems: 'center',
    marginTop: 25,
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
    color: color.shipCove,
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  receiveText: {
    color: color.mantis,
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  swapText: {
    color: color.nevada,
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  assetsTitle: {
    color: color.black,
    fontSize: 13,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 20,
  },
  spliteLine: {
    borderRightWidth: 1,
    borderColor: color.grayD1,
    height: 15,
    marginBottom: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  addWalletButtonView: {
    flex: 1,
  },
  addWalletText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  addWalletButton: {
    backgroundColor: color.whiteA50,
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
  myAssetsTitle: {
    position: 'absolute',
    top: 25,
    left: 30,
  },
  myAssets: {
    position: 'absolute',
    top: 57,
    left: 30,
  },
});

const WalletPlaceholder = () => {
  const WalletItem = () => (
    <Placeholder
      Animation={Fade}
    >
      <TouchableOpacity style={coinListItemStyles.row}>
        <PlaceholderMedia isRound style={coinListItemStyles.icon} />
        <View style={coinListItemStyles.rowRightView}>
          <View style={coinListItemStyles.rowTitleView}>
            <PlaceholderLine width={50} height={20} />
          </View>
        </View>
      </TouchableOpacity>
    </Placeholder>
  );

  const addAssetButton = (
    <View style={styles.addAssetView}>
      <TouchableOpacity style={styles.addAsset}>
        <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
        <Loc text="page.wallet.list.addAsset" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={[flex.flex1]}>
      <View style={styles.headerTitle} />
      <View style={styles.headerBoardView}>
        <View style={styles.headerBoard}>
          <Placeholder
            Animation={Fade}
          >
            <PlaceholderLine width={50} height={20} style={styles.myAssetsTitle} />
            <PlaceholderLine width={35} height={40} style={styles.myAssets} />
          </Placeholder>
          <View style={styles.myAssetsButtonsView}>
            <TouchableOpacity style={styles.ButtonView}>
              <Image source={references.images.send} />
              <Loc style={[styles.sendText]} text="button.Send" />
            </TouchableOpacity>
            <View style={styles.spliteLine} />
            <TouchableOpacity style={styles.ButtonView}>
              <Image source={references.images.receive} />
              <Loc style={[styles.receiveText]} text="button.Receive" />
            </TouchableOpacity>
            <View style={styles.spliteLine} />
            <TouchableOpacity style={[styles.ButtonView, styles.noBorderRight, { opacity: 1 }]}>
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
            data={['p1', 'p2']}
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

export default WalletPlaceholder;
