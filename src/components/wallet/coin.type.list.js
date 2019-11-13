import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Item from './coin.type.list.item';

export default function CoinTypeList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item data={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

CoinTypeList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    coin: PropTypes.string,
    selected: PropTypes.bool.isRequired,
  })).isRequired,
};
