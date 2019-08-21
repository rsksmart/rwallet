import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PropTypes } from 'prop-types';
import ListFooter from 'mellowallet/src/components/ListFooter';
import { printError } from 'mellowallet/src/utils';
import Wallet from 'mellowallet/src/store/models';
import HistoryListItem from 'mellowallet/src/components/History/HistoryListItem';

const styles = StyleSheet.create({
  list: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

class WalletHistoryList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      historyItems: [],
      nextPage: 0,
      isThereMore: true,
    };
  }

  componentDidMount() {
    this.loadHistories(0);
  }

  loadHistories = async (pageNumber) => {
    this.setState({ isLoading: true });
    const { pageSize, order, wallet } = this.props;
    wallet.originalWallet.get_history(pageNumber, pageSize, order)
      .then((histories) => {
        if (histories.length === 0) {
          this.setState({
            isLoading: false,
            isThereMore: false,
          });
          return;
        }

        this.setState(prevState => ({
          historyItems: pageNumber === 0
            ? [...histories]
            : [...prevState.historyItems, ...histories],
          isLoading: false,
          nextPage: pageNumber + 1,
          isThereMore: true,
        }));
      })
      .catch(e => printError(e));
  }

  loadMoreHistories = () => {
    const { isLoading, isThereMore, nextPage } = this.state;
    if (isLoading || !isThereMore) {
      return;
    }
    this.loadHistories(nextPage);
  }

  onRefresh = async () => {
    await this.loadHistories(0);
    await this.setState({ isRefreshing: false });
  }

  renderEmptyListComponent = () => (<View />)

  /**
  * Returns the History item view
  * @param {*} item
  */
  renderHistoryItem = ({ item }) => (
    <HistoryListItem historyItem={item} />
  )

  /**
   * Returns list's loading footers
   */
  renderListFooterComponent = () => {
    const { isLoading } = this.state;
    return (isLoading && <ListFooter />);
  }

  render() {
    const { historyItems } = this.state;
    return (
      <FlatList
        ref={(c) => { this.flatList = c; }}
        data={historyItems.slice()}
        renderItem={this.renderHistoryItem}
        ListEmptyComponent={this.renderEmptyListComponent}
        keyExtractor={item => item.tx_hash}
        ListFooterComponent={this.renderListFooterComponent}
        refreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={this.loadMoreHistories}
        removeClippedSubviews
        style={styles.list}
      />
    );
  }
}

WalletHistoryList.propTypes = {
  pageSize: PropTypes.number,
  order: PropTypes.string,
  wallet: PropTypes.shape(Wallet).isRequired,
};

WalletHistoryList.defaultProps = {
  pageSize: 10,
  order: 'newest_first',
};

export default WalletHistoryList;
