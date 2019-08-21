import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { View } from 'native-base';
import { PropTypes } from 'prop-types';

var icons = {
    'mellowallet/assets/coins/alg.png': require('mellowallet/assets/coins/alg.png'),
    'mellowallet/assets/coins/btc.png': require('mellowallet/assets/coins/btc.png'),
    'mellowallet/assets/coins/dai.png': require('mellowallet/assets/coins/dai.png'),
    'mellowallet/assets/coins/eth.png': require('mellowallet/assets/coins/eth.png'),
    'mellowallet/assets/coins/rbtc.png': require('mellowallet/assets/coins/rbtc.png'),
    'mellowallet/assets/coins/rif.png': require('mellowallet/assets/coins/rif.png')
};

const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
});

const currencySymbol = (props) => {
  const imageIcon = icons[props.image];

  const alpha = props.emptyState ? <View style={styles.emptyState} /> : null;

  return imageIcon
    ? (
      <ImageBackground source={imageIcon} {...props}>
        {alpha}
      </ImageBackground>
    )
    : <View />;
};

currencySymbol.propTypes = {
  symbol: PropTypes.string.isRequired,
  emptyState: PropTypes.bool,
};

currencySymbol.defaultProps = {
  emptyState: false,
};

export default currencySymbol;
