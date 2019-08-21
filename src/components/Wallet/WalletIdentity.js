import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { PropTypes } from 'prop-types';
import Coin from '../Coin';

const invertedStyles = StyleSheet.create({
  text: {
    color: '#FFF',
  },
});

const defaultStyles = StyleSheet.create({
  text: {
    color: '#000',
  },
});

const walletIndentity = (props) => {
  const style = props.inverted ? invertedStyles : defaultStyles;
  return (
    <View>
      <Coin
        symbol={props.network.symbol}
        name={props.network.name}
        image={props.network.image}
        inverted={props.inverted}
      />
      <Text note style={style.text}>{props.name}</Text>
    </View>
  );
};

walletIndentity.propTypes = {
  name: PropTypes.string.isRequired,
  inverted: PropTypes.bool,
  network: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

walletIndentity.defaultProps = {
  inverted: false,
};

export default walletIndentity;
