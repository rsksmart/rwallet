import React from 'react';
import { StyleSheet } from 'react-native';
import { H1, View } from 'native-base';
import { PropTypes } from 'prop-types';
import CurrencySymbol from './CurrencySymbol';

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 5,
  },
  emptyState: {
    color: '#DDD',
  },
});

const invertedStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  name: {
    marginLeft: 5,
    color: '#FFF',
  },
});

const coin = (props) => {
  const style = props.inverted ? invertedStyles : defaultStyles;

  const currencySymbolStyle = {
    width: props.coinSize,
    height: props.coinSize,
  };

  return (
    <View style={[style.container, { flexDirection: props.flexDirection }]}>
      <CurrencySymbol
        symbol={props.symbol}
        style={currencySymbolStyle}
        emptyState={props.emptyState}
        image={props.image}
      />
      <H1 style={[
        style.name,
        props.nameStyle,
        props.emptyState ? defaultStyles.emptyState : {},
      ]}
      >
        {props.name}
      </H1>
    </View>
  );
};

coin.propTypes = {
  name: PropTypes.string.isRequired,
  nameStyle: PropTypes.shape({}),
  inverted: PropTypes.bool,
  flexDirection: PropTypes.string,
  coinSize: PropTypes.number,
  emptyState: PropTypes.bool,
  symbol: PropTypes.string.isRequired,
};

coin.defaultProps = {
  nameStyle: {},
  inverted: false,
  flexDirection: 'row',
  coinSize: 30,
  emptyState: false,
};

export default coin;
