import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import ListFooter from 'mellowallet/src/components/ListFooter';
import Wallet from 'mellowallet/src/store/models';
import SwipeableWalletItem from 'mellowallet/src/screens/Home/Wallets/SwipeableWalletItem';
import WarningCard from 'mellowallet/src/components/WarningCard';
import { t } from 'mellowallet/src/i18n';

const styles = StyleSheet.create({
  walletsList: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 90,
  },
});

class WalletList extends React.PureComponent {
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

  /**
  * Returns the wallet item view
  * @param {*} item
  */
  renderWalletItem = ({ item }) => (
    <SwipeableWalletItem
      wallet={item}
      onSwipeAction={this.changeScrollStatus}
      favourite={this.props.favouriteWallet && item.id === this.props.favouriteWallet.id}
    />
  )

  changeScrollStatus = scrollEnabled => this.flatList.setNativeProps({ scrollEnabled });

  /**
   * Returns list's loading footers
   */
  renderListFooterComponent = () => {
    const { isLoading } = this.props;
    return (isLoading && <ListFooter />);
  }

  render() {
    const { wallets, isRefreshing, onRefresh } = this.props;
    return (
      <FlatList
        ref={(c) => { this.flatList = c; }}
        data={wallets.slice()}
        renderItem={this.renderWalletItem}
        ListEmptyComponent={this.renderEmptyListComponent}
        keyExtractor={wallet => `${wallet.id}`}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListFooterComponent={this.renderListFooterComponent}
        contentContainerStyle={styles.walletsList}
      />
    );
  }
}

WalletList.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)),
  isLoading: PropTypes.bool,
  favouriteWallet: PropTypes.shape(Wallet),
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

WalletList.defaultProps = {
  wallets: [],
  isLoading: true,
  favouriteWallet: null,
  isRefreshing: false,
  onRefresh: () => null,
};

export default WalletList;
