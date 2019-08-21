import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Card,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';
import Wallet from 'mellowallet/src/store/models';
import WalletCardItem from 'mellowallet/src/components/Wallet/WalletCardItem';
import LoadingCard from 'mellowallet/src/components/LoadingCard';
import { connect } from 'react-redux';
import { round } from 'mellowallet/src/utils';
import NavigationService from 'mellowallet/src/services/NavigationService';
import { conf } from '../../../utils/constants';

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
  },
});

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
  };
};

class WalletListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  onWalletPress = () => {
    const { wallet } = this.props;
    NavigationService.navigate('WalletDetails', { wallet });
  };

  renderLoadingCard = () => (
    <LoadingCard/>
  );

  renderWalletCard = () => {
    const { name, network, balance } = this.props.wallet;
    const { favourite } = this.props;
    const {
      fiat_unit,
      fiat_value,
      value,
    } = balance;

    const networkModel = this.props.networks[network];

    return (
      <View>
        <Card style={styles.card}>
          <WalletCardItem
            button
            network={networkModel}
            name={name}
            primaryAmout={`${fiat_unit} ${round(fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
            secondaryAmount={value}
            onPress={this.onWalletPress}
            favourite={favourite}
          />
        </Card>
      </View>
    );
  };

  render() {
    const { isLoading } = this.state;
    return isLoading
      ? this.renderLoadingCard()
      : this.renderWalletCard();
  }
}


WalletListItem.propTypes = {
  wallet: PropTypes.shape(Wallet).isRequired,
  networks: PropTypes.shape({}).isRequired,
  favourite: PropTypes.bool,
};

WalletListItem.defaultProps = {
  favourite: false,
};

export default connect(mapStateToProps)(WalletListItem);
