import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import {
  Container,
  ListItem,
  Left,
  Thumbnail,
  Body,
  Text,
} from 'native-base';
import * as rssParser from 'react-native-rss-parser';
import moment from 'moment';

import ListFooter from 'mellowallet/src/components/ListFooter';
import WarningCard from 'mellowallet/src/components/WarningCard';
import { t } from 'mellowallet/src/i18n';
import {
  getLanguage,
  openLink,
  printError,
} from 'mellowallet/src/utils';
import { conf } from 'mellowallet/src/utils/constants';
import { setPortfolioRefresh } from 'mellowallet/src/store/actions/portfolio';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
  const { portfolioReducer } = state;
  return {
    refreshPortfolio: portfolioReducer.refreshPortfolio,
  };
};

const mapDispatchToProps = dispatch => ({
  setPortfolioRefresh: value => dispatch(setPortfolioRefresh(value)),
});


class NewsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      isLoading: false,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.loadFeeds();
  }

  componentWillReceiveProps(props) {
    if (props.refreshPortfolio) {
      this.setState({ isRefreshing: true });
      this.loadFeeds();
      this.props.setPortfolioRefresh(false);
      this.setState({ isRefreshing: false });
    }
  }

  loadFeeds = async () => {
    this.setState({ isLoading: true });
    const link = await this.getRSSLink();
    fetch(link)
      .then(response => response.text())
      .then(responseData => rssParser.parse(responseData))
      .then((rss) => {
        this.setState({
          feeds: rss.items,
          isLoading: false,
        });
      })
      .catch(e => printError(e));
  };

  getRSSLink = async () => {
    const userLanguage = await getLanguage();

    if (userLanguage === 'es') {
      return conf('SPANISH_RSS_FEEDS_URL');
    }

    return conf('ENGLISH_RSS_FEEDS_URL');
  };

  renderEmptyListComponent = () => {
    const { isLoading } = this.state;
    return !isLoading
      && (
        <WarningCard
          color="#17EAD9"
          iconName="error-outline"
          message={t('There are not any news')}
        />
      );
  };

  renderFeedItem = ({ item }) => (
    <ListItem
      button
      noBorder
      thumbnail
      onPress={() => openLink(item.links[0].url)}
    >
      <Left>
        <Thumbnail square source={{ uri: item.enclosures[0].url }}/>
      </Left>
      <Body>
        <Text note>{moment(item.published)
          .format('LL')}</Text>
        <Text>{item.title}</Text>
      </Body>
    </ListItem>
  );

  /**
   * Returns list's loading footers
   */
  renderListFooterComponent = () => {
    const { isLoading } = this.state;
    return (isLoading && <ListFooter/>);
  };

  keyExtractor = feed => feed.id;

  render() {
    const { feeds, isRefreshing } = this.state;

    return (
      <Container>
        <FlatList
          data={feeds.slice()}
          renderItem={this.renderFeedItem}
          ListEmptyComponent={this.renderEmptyListComponent}
          keyExtractor={this.keyExtractor}
          refreshing={isRefreshing}
          ListFooterComponent={this.renderListFooterComponent}
        />
      </Container>
    );
  }
}

NewsScreen.propTypes = {
  setPortfolioRefresh: PropTypes.func.isRequired,
  refreshPortfolio: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
