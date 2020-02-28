import React, { Component } from 'react';
import {
  Animated, View, Image, StyleSheet, Dimensions, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ParallaxSwiper, ParallaxSwiperPage } from '../../components/common/swiper';

const { width: winWidth, height: winHeight } = Dimensions.get('window');
const pageWidth = winWidth - 100;
const addPageWidth = 200;
const endPageWidth = 200;

const styles = StyleSheet.create({
  backgroundImage: {
    width: winWidth,
    height: winHeight,
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  foregroundText: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.41,
    color: 'white',
  },
});

class WalletList extends Component {
  myCustomAnimatedValue = new Animated.Value(0);

  render() {
    return (
      <ParallaxSwiper
        speed={0.5}
        animatedValue={this.myCustomAnimatedValue}
        backgroundColor="black"
        onMomentumScrollEnd={(activePageIndex) => console.log(activePageIndex)}
      >
        <ParallaxSwiperPage
          style={{ width: addPageWidth }}
          width={addPageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/wtHtxG' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Add
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          style={{ width: pageWidth }}
          width={pageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/wtHtxG' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Page 1
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          style={{ width: pageWidth }}
          width={pageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/KAaVXt' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Page 2
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          width={pageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/gt4rWa' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Page 3
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          width={pageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/KAaVXt' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Page 4
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          width={pageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/wtHtxG' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                Page 5
              </Text>
            </View>
          )}
        />
        <ParallaxSwiperPage
          width={endPageWidth}
          BackgroundComponent={(
            <Image
              style={styles.backgroundImage}
              source={{ uri: 'https://goo.gl/wtHtxG' }}
            />
          )}
          component={(
            <View style={styles.foregroundTextContainer}>
              <Text style={[styles.foregroundText]}>
                End
              </Text>
            </View>
          )}
        />
      </ParallaxSwiper>
    );
  }
}

WalletList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

export default connect(mapStateToProps)(WalletList);
