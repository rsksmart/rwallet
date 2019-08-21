import React from 'react';
import {
  Body,
  CardItem,
  Left,
  Right,
  Icon,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import WalletIndentity from 'mellowallet/src/components/Wallet/WalletIdentity';


const styles = StyleSheet.create({
  rightText: {
    textAlign: 'right',
  },
  walletCardItem: {
    marginRight: 0,
    marginLeft: 0,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  centerBody: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 0,
  },
  transferIcon: {
    color: 'grey',
  },
});

class HistoryExchangeCardItem extends React.PureComponent {
  render() {
    const {
      button,
      onPress,
      fromNetwork,
      fromAmount,
      toNetwork,
      toAmount,
    } = this.props;

    return (
      <CardItem
        style={styles.walletCardItem}
        button={button}
        onPress={onPress}
      >
        <Left>
          <Body>
            <WalletIndentity
              network={fromNetwork}
              name={fromAmount}
            />
          </Body>
        </Left>
        <Body style={styles.centerBody}>
          <Icon
            name="swap-horiz"
            style={styles.transferIcon}
          />
        </Body>
        <Right>
          <Body>
            <WalletIndentity
              network={toNetwork}
              name={toAmount}
            />
          </Body>
        </Right>
      </CardItem>
    );
  }
}

HistoryExchangeCardItem.propTypes = {
  fromNetwork: PropTypes.shape({}).isRequired,
  fromAmount: PropTypes.string.isRequired,
  toNetwork: PropTypes.shape({}).isRequired,
  toAmount: PropTypes.string.isRequired,
  button: PropTypes.bool,
  onPress: PropTypes.func,
};

HistoryExchangeCardItem.defaultProps = {
  button: false,
  onPress: null,
};

export default HistoryExchangeCardItem;
