import React from 'react';
import {
  CardItem,
  Left,
  Right,
  View,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import Title from 'mellowallet/src/components/Title';
import WalletIndentity from 'mellowallet/src/components/Wallet/WalletIdentity';


const styles = StyleSheet.create({
  rightText: {
    textAlign: 'right',
  },
  walletCardItem: {
    marginRight: 0,
    marginLeft: 0,
    borderRadius: 5,
  },
  spaceView: {
    width: 10,
  },
});

const outputStyle = StyleSheet.create({
  amount: {
    color: 'red',
  },
});

const inputStyle = StyleSheet.create({
  amount: {
    color: 'green',
  },
});

class HistoryTransferCardItem extends React.PureComponent {
  render() {
    const {
      button,
      onPress,
      network,
      name,
      primaryAmout,
      secondaryAmount,
      isOutput,
    } = this.props;

    const amountStyle = isOutput ? outputStyle : inputStyle;

    return (
      <CardItem
        style={styles.walletCardItem}
        button={button}
        onPress={onPress}
      >
        <Left>
          <WalletIndentity
            network={network}
            name={name}
          />
        </Left>
        <View style={styles.spaceView} />
        <Right>
          <Title
            title={primaryAmout}
            subtitle={secondaryAmount}
            titleStyle={[styles.rightText, amountStyle.amount]}
            subtitleStyle={[styles.rightText, amountStyle.amount]}
          />
        </Right>
      </CardItem>
    );
  }
}

HistoryTransferCardItem.propTypes = {
  network: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  primaryAmout: PropTypes.string,
  secondaryAmount: PropTypes.string,
  button: PropTypes.bool,
  onPress: PropTypes.func,
  isOutput: PropTypes.bool,
};

HistoryTransferCardItem.defaultProps = {
  name: '',
  primaryAmout: '',
  secondaryAmount: '',
  button: false,
  onPress: null,
  isOutput: false,
};

export default HistoryTransferCardItem;
