import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import Application from 'mellowallet/lib/Application';

import ListFooter from 'mellowallet/src/components/ListFooter';
import WarningCard from 'mellowallet/src/components/WarningCard';
import { t } from 'mellowallet/src/i18n';
import { printError } from 'mellowallet/src/utils';

import HistoryListItem from 'mellowallet/src/components/History/HistoryListItem';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    order: rootReducer.order,
  };
};

const styles = StyleSheet.create({
  list: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

class HistoryList extends React.PureComponent {
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

  componentWillReceiveProps(props) {
    const { order } = props;
    if (order) {
      this.loadHistories(0);
    }
  }

  loadHistories = async (pageNumber) => {
    this.setState({ isLoading: true });
    const { pageSize, order } = this.props;
    Application(app => app.get_history(pageNumber, pageSize, order))
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
    if (this.state.isLoading || !this.state.isThereMore) {
      return;
    }
    this.loadHistories(this.state.nextPage);
  }

  onRefresh = async () => {
    await this.loadHistories(0);
    await this.setState({ isRefreshing: false });
  }

  renderEmptyListComponent = () => {
    const { isLoading } = this.state;
    return !isLoading
      && (
        <WarningCard
          color="#17EAD9"
          iconName="error-outline"
          message={t("You don't have any transaction yet.")}
        />
      );
  };

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
    const { order } = this.props;
    return (
      <FlatList
        ref={(c) => { this.flatList = c; }}
        data={historyItems.slice()}
        extraData={order}
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

HistoryList.propTypes = {
  pageSize: PropTypes.number,
  order: PropTypes.string,
};

HistoryList.defaultProps = {
  pageSize: 10,
  order: 'newest_first',
};

export default connect(mapStateToProps, null)(HistoryList);
