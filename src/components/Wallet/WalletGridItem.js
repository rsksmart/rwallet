import React from 'react';
import {
  H2,
  Text,
  View,
} from 'native-base';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Wallet from 'mellowallet/src/store/models';
import Coin from 'mellowallet/src/components/Coin';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
  };
};

const styles = StyleSheet.create({
  balanceEmpty: {
    color: '#DDD',
  },
  balance: {
    fontSize: 24,
  },
  gridItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class WalletGridItem extends React.PureComponent {
  render() {
    const { networks, wallet } = this.props;
    const {
      name,
      balance,
      network,
    } = wallet;

    const cryptoNetwork = networks[network];
    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor="#FFF">
        <View style={styles.gridItem}>
          <Coin
            name={cryptoNetwork.name}
            symbol={cryptoNetwork.symbol}
            image={cryptoNetwork.image}
            flexDirection="column"
            coinSize={60}
            nameStyle={{ fontSize: 20 }}
            emptyState={this.props.emptyState}
          />
          <Text
            style={[styles.balance, (this.props.emptyState ? styles.balanceEmpty : {})]}
          >
            {balance.value}
          </Text>
          <Text note style={styles.text}>{name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

WalletGridItem.propTypes = {
  wallet: PropTypes.shape(Wallet),
  emptyState: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  networks: PropTypes.shape({}).isRequired,
};

WalletGridItem.defaultProps = {
  wallet: null,
  emptyState: false,
};

export default connect(mapStateToProps)(WalletGridItem);
