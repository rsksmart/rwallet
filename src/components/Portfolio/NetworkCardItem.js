import React, { PureComponent } from 'react';
import {
  CardItem,
  View,
  Text,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import Title from 'mellowallet/src/components/Title';
import {
  round,
  cotizationVariationFormatter,
  fiatValueFormatter,
} from 'mellowallet/src/utils';
import Coin from '../Coin';


const styles = StyleSheet.create({
  rightValues: {
    flex: 1,
  },
  primaryAmountText: {
    fontSize: 24,
    color: '#7ED321',
  },
  primaryAmountTextInverted: {
    fontSize: 24,
    color: 'red',
  },
  networkCardItem: {
    marginRight: 0,
    marginLeft: 0,
    borderRadius: 5,
  },
  rightText: {
    textAlign: 'right',
  },
  text: {
    color: '#000',
  },
  rowSpace: {
    marginTop: 5,
  },
});


class NetworkCardItem extends PureComponent {
  render() {
    const { button, network } = this.props;
    const variationColor = (network.variation < 0) && styles.primaryAmountTextInverted;

    return (
      <CardItem
        style={styles.networkCardItem}
        button={button}
      >

        <View>
          <Coin
            symbol={network.symbol}
            name={network.name}
            image={network.image}
          />
          <Text note style={styles.rowSpace}>
            {`${round(network.totalCrypto, 7)} (USD ${fiatValueFormatter(network.cryptoCotization)})`}
          </Text>
        </View>
        <View style={styles.rightValues}>
          <Title
            title={`${cotizationVariationFormatter(network.variation)} %`}
            subtitle={`${network.totalBalanceUnit} ${fiatValueFormatter(network.totalBalance)}`}
            titleStyle={[
              styles.rightText,
              styles.primaryAmountText,
              variationColor,
            ]}
            subtitleStyle={[
              styles.rightText,
              styles.text,
              styles.rowSpace,
            ]}
          />
        </View>
      </CardItem>
    );
  }
}

NetworkCardItem.propTypes = {
  network: PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalBalance: PropTypes.number.isRequired,
    totalBalanceUnit: PropTypes.string.isRequired,
    totalCrypto: PropTypes.number.isRequired,
    cryptoCotization: PropTypes.number.isRequired,
    variation: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  button: PropTypes.bool,
};

NetworkCardItem.defaultProps = {
  button: false,
};

export default NetworkCardItem;
