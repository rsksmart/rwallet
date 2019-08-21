import React, { PureComponent } from 'react';
import {
  Card,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';
import NetworkCardItem from 'mellowallet/src/components/Portfolio/NetworkCardItem';
import LoadingCard from 'mellowallet/src/components/LoadingCard';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
  };
};


class NetworkListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  renderLoadingCard = () => (
    <LoadingCard />
  )

  addNetworkSymbol = () => {
    const { network, networks } = this.props;
    return { ...network, symbol: networks[network.id].symbol, name: networks[network.id].name };
  };

  renderNetworkCard = () => {
    const networkUpdated = this.addNetworkSymbol();
    return (
      <View>
        <Card>
          <NetworkCardItem
            button
            network={networkUpdated}
          />
        </Card>
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    return isLoading
      ? this.renderLoadingCard()
      : this.renderNetworkCard();
  }
}

NetworkListItem.propTypes = {
  networks: PropTypes.shape({}).isRequired,
  network: PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalBalance: PropTypes.number.isRequired,
    totalBalanceUnit: PropTypes.string.isRequired,
    totalCrypto: PropTypes.number.isRequired,
    cryptoCotization: PropTypes.number.isRequired,
    variation: PropTypes.number.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(NetworkListItem);
