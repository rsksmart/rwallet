import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import ListFooter from 'mellowallet/src/components/ListFooter';
import WarningCard from 'mellowallet/src/components/WarningCard';
import { t } from 'mellowallet/src/i18n';
import NetworkListItem from './NetworkListItem';


const styles = StyleSheet.create({
  flatList: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 75,
  },
});


class NetworkList extends PureComponent {
  renderEmptyListComponent = () => {
    const { isLoading } = this.props;
    return !isLoading
      && (
        <WarningCard
          color="#17EAD9"
          iconName="error-outline"
          message={t("You don't have any Mellow wallet yet. Let's create the first one!")}
        />
      );
  };

  renderNetworkItem = ({ item }) => (<NetworkListItem network={item} />);

  renderListFooterComponent = () => {
    const { isLoading } = this.props;
    return (isLoading && <ListFooter />);
  }

  render() {
    const { networks } = this.props;
    return (
      <FlatList
        data={networks}
        renderItem={this.renderNetworkItem}
        ListEmptyComponent={this.renderEmptyListComponent}
        keyExtractor={network => network.id}
        ListFooterComponent={this.renderListFooterComponent}
        style={styles.flatList}
      />
    );
  }
}

NetworkList.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalBalance: PropTypes.number.isRequired,
    totalBalanceUnit: PropTypes.string.isRequired,
    totalCrypto: PropTypes.number.isRequired,
    cryptoCotization: PropTypes.number.isRequired,
    variation: PropTypes.number.isRequired,
  })),
  isLoading: PropTypes.bool,
};

NetworkList.defaultProps = {
  networks: [],
  isLoading: true,
};

export default NetworkList;
