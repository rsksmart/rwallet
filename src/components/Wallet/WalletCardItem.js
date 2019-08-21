import React from 'react';
import {
  CardItem,
  View,
} from 'native-base';
import material from 'mellowallet/native-base-theme/variables/material';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import Title from 'mellowallet/src/components/Title';
import WalletIndentity from './WalletIdentity';

const defaultStyles = StyleSheet.create({
  rightValues: {
    flex: 1,
  },
  primaryAmountText: {
    fontSize: 24,
  },
  walletCardItem: {
    marginRight: 0,
    marginLeft: 0,
    borderRadius: 5,
  },
  rightText: {
    textAlign: 'right',
  },
});

const invertedStyles = StyleSheet.create({
  rightText: {
    color: '#FFF',
  },
  walletCardItem: {
    backgroundColor: material.brandPrimary,
  },
});

class WalletCardItem extends React.PureComponent {
  render() {
    const {
      button,
      onPress,
      name,
      primaryAmout,
      secondaryAmount,
      favourite,
      network,
    } = this.props;

    return (
      <CardItem
        style={[defaultStyles.walletCardItem, favourite && invertedStyles.walletCardItem]}
        button={button}
        onPress={onPress}
      >
        <View>
          <WalletIndentity
            network={network}
            name={name}
            inverted={favourite}
          />
        </View>
        <View style={defaultStyles.rightValues}>
          <Title
            title={primaryAmout}
            subtitle={secondaryAmount}
            titleStyle={
              [
                defaultStyles.rightText,
                defaultStyles.primaryAmountText,
                favourite && invertedStyles.rightText,
              ]
            }
            subtitleStyle={[defaultStyles.rightText, favourite && invertedStyles.rightText]}
            inverted={favourite}
          />
        </View>
      </CardItem>
    );
  }
}

WalletCardItem.propTypes = {
  network: PropTypes.shape({}).isRequired,
  name: PropTypes.string,
  primaryAmout: PropTypes.string,
  secondaryAmount: PropTypes.string,
  button: PropTypes.bool,
  onPress: PropTypes.func,
  favourite: PropTypes.bool,
};

WalletCardItem.defaultProps = {
  name: '',
  primaryAmout: '',
  secondaryAmount: '',
  button: false,
  onPress: null,
  favourite: false,
};

export default WalletCardItem;
