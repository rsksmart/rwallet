import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  View,
  Button,
  Icon,
  Text,
} from 'native-base';
import { PropTypes } from 'prop-types';
import Menu, { MenuItem } from 'react-native-material-menu';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { t } from 'mellowallet/src/i18n';
import { setHistoryOrder } from 'mellowallet/src/store/actions/history';
import material from 'mellowallet/native-base-theme/variables/material';

import HistoryList from './HistoryList';

const mapDispatchToProps = dispatch => ({
  setHistoryOrder: order => dispatch(setHistoryOrder(order)),
});


const styles = StyleSheet.create({
  sortOptions: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    color: 'black',
  },
  optionSelected: {
    color: material.brandPrimary,
  },
});

const sortOptions = {
  newestFirst: {
    key: 'newest_first',
    label: 'Newest First',
  },
  oldestFirst: {
    key: 'oldest_first',
    label: 'Oldest First',
  },
};

class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOption: sortOptions.newestFirst,
    };
  }

  onOrderChange = (sortOption) => {
    this.hideSortOptions();
    this.setState({ sortOption });
    this.props.setHistoryOrder(sortOption.key);
  }

  setSortOptionsRef = (ref) => {
    this.menu = ref;
  }

  hideSortOptions = () => {
    this.menu.hide();
  };

  showSortOptions = () => {
    this.menu.show();
  };

  renderSortOptionsButton = () => (
    <Button
      transparent
      onPress={this.showSortOptions}
    >
      <Icon name="filter-list" style={styles.icon} />
    </Button>
  )

  renderSortOptionItem = (option) => {
    const style = sortOptions[option].key === this.state.sortOption.key ?
      styles.optionSelected
      : null;
    return (
      <MenuItem
        key={sortOptions[option].key}
        onPress={() => this.onOrderChange(sortOptions[option])}
        textStyle={style}
      >
        {t(sortOptions[option].label)}
      </MenuItem>
    );
  }


  renderSortOptions = () => {
    const sortButton = this.renderSortOptionsButton();
    const options = Object.keys(sortOptions).map(option => this.renderSortOptionItem(option));
    return (
      <Menu
        ref={this.setSortOptionsRef}
        button={sortButton}
      >
        {options}
      </Menu>
    );
  }

  render() {
    const { sortOption } = this.state;
    const sortOptionsMenu = this.renderSortOptions();
    return (
      <Container>
        <ActionHeader
          title={t('History')}
        />
        <View style={styles.sortOptions}>
          <Text>{`${t('Sorted By')}: ${t(sortOption.label)}`}</Text>
          {sortOptionsMenu}
        </View>
        <HistoryList />
      </Container>
    );
  }
}

HistoryScreen.propTypes = {
  setHistoryOrder: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(HistoryScreen);
