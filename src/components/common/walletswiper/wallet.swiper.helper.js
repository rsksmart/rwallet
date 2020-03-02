import React from 'react';
import {
  Dimensions, View, TouchableOpacity, StyleSheet, Image, Text,
} from 'react-native';
import ParallaxSwiperPage from './parallax.swiper.page';
import WalletSwiperPage from './wallet.swiper.page';
import references from '../../../assets/references';

const styles = StyleSheet.create({
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

const { width: winWidth } = Dimensions.get('window');

const helper = {
  pageWidth: winWidth - 50,
  addPageWidth: 100,

  createWalletSwiperPage(index, walletData, onSendPressed,
    onReceivePressed, onSwapPressed, onAddAssetPressed,
    currencySymbol, totalAssetValueText) {
    const page = (
      <WalletSwiperPage
        walletData={walletData}
        onSendPressed={onSendPressed}
        onReceivePressed={onReceivePressed}
        onSwapPressed={onSwapPressed}
        onAddAssetPressed={onAddAssetPressed}
        currencySymbol={currencySymbol}
        totalAssetValueText={totalAssetValueText}
      />
    );
    const swiperPage = (
      <ParallaxSwiperPage
        key={index.toString()}
        width={this.pageWidth}
        component={page}
      />
    );
    return swiperPage;
  },

  createAddWalletPage() {
    console.log('createAddWalletPage');
    const addWalletPage = (
      <View style={[styles.addWalletButtonView]}>
        <TouchableOpacity style={styles.addWalletButton} onPress={this.onAddWalletPressed}>
          <Image source={references.images.addWallet} />
          <Text style={[styles.addWalletText]}>
            Add Wallet
          </Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <ParallaxSwiperPage
        width={this.addPageWidth}
        component={addWalletPage}
        isFirstPage
      />
    );
  },
};

export default helper;
