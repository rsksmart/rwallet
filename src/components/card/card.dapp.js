import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import Loc from '../common/misc/loc';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  cardTitleText: {
    color: '#4A4A4A',
    fontSize: 20,
    fontFamily: 'Avenir-Medium',
  },
  cardButtonText: {
    color: '#028CFF',
    fontFamily: 'Avenir-Roman',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
});

export default function DappCard({
  title, data, type, getItem,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Loc style={styles.cardTitleText} text={title} />
        <TouchableOpacity>
          <Loc style={styles.cardButtonText} text="page.dapp.seeAll" />
        </TouchableOpacity>
      </View>

      {
        type === 'row' && (
          <View style={styles.row}>
            {data.map((item) => getItem(item))}
          </View>
        )
      }

      {
        type === 'nest' && (
          <FlatList
            data={data}
            renderItem={getItem}
            horizontal
          />
        )
      }

      {
        type === 'list' && (
          <FlatList
            data={data}
            renderItem={getItem}
          />
        )
      }
    </View>
  );
}

DappCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.string,
  getItem: PropTypes.func,
};

DappCard.defaultProps = {
  data: [],
  type: 'row',
  getItem: () => null,
};
