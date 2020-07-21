import React, { Component } from 'react';
import {
  Image,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';

import PropTypes from 'prop-types';
import Carousel from '@amazingbeerbelly/react-native-snap-carousel';
import WalletPage from './wallet.carousel.page.wallet';
import { screen } from '../../../common/info';
import references from '../../../assets/references';
import color from '../../../assets/styles/color';
import Loc from '../../../components/common/misc/loc';

const styles = StyleSheet.create({
  carousel: {
  },
  item: {
    borderWidth: 2,
    backgroundColor: color.white,
    flex: 1,
    borderRadius: 5,
    borderColor: color.white,
    elevation: 3,
  },
  imageBackground: {
    flex: 2,
    backgroundColor: color.grayEB,
    borderWidth: 5,
    borderColor: color.white,
  },
  rightTextContainer: {
    marginLeft: 'auto',
    marginRight: -2,
    backgroundColor: color.tunaA50,
    padding: 3,
    marginTop: 3,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightText: {
    color: color.white,
  },
  lowerContainer: {
    flex: 1,
    margin: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentText: {
    marginTop: 10,
    fontSize: 12,
  },
  addWalletButtonView: {
    flex: 1,
    backgroundColor: color.transparent,
  },
  addWalletText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
    fontSize: 12,
    marginTop: 10,
  },
  addWalletButton: {
    backgroundColor: color.whiteA50,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    height: 166,
    marginTop: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class WalletCarousel extends Component {
  onAddWalletPressed = () => {
    const { navigation } = this.props;
    try {
      this.carousel.scrollToIndex(1);
    } catch (error) {
      this.carousel.snapToItem(1);
    }
    navigation.navigate('WalletAddIndex');
  }

  render() {
    const { data, pageWidth } = this.props;
    data.unshift({ index: -1 });

    const renderItem = (itemData) => {
      const {
        walletData, onSendPressed, onReceivePressed, onSwapPressed, onScanQrcodePressed,
        onAddAssetPressed, currencySymbol, hasSwappableCoin, index,
      } = itemData.item;
      if (index < 0) {
        return (
          <View style={[styles.addWalletButtonView]}>
            <TouchableOpacity style={[styles.addWalletButton, { width: pageWidth / 2 + (screen.width - pageWidth) / 3 }]} onPress={this.onAddWalletPressed}>
              <Image source={references.images.addWallet} />
              <Loc style={[styles.addWalletText]} text="page.wallet.list.addWallet" />
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <WalletPage
          walletData={walletData}
          onSendPressed={onSendPressed}
          onReceivePressed={onReceivePressed}
          onSwapPressed={onSwapPressed}
          onAddAssetPressed={onAddAssetPressed}
          currencySymbol={currencySymbol}
          hasSwappableCoin={hasSwappableCoin}
          onScanQrcodePressed={onScanQrcodePressed}
        />
      );
    };

    return (
      <Carousel
        ref={(ref) => { this.carousel = ref; }}
        style={styles.carousel}
        data={data}
        renderItem={renderItem}
        sliderWidth={screen.width}
        itemWidth={pageWidth}
        containerWidth={screen.width}
        initialIndex={1}
        firstItem={1}
        bounces={false}
        removeClippedSubviews={false}
      />
    );
  }
}

WalletCarousel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  pageWidth: PropTypes.number.isRequired,
};

export default WalletCarousel;
