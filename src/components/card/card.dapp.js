import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
  navigation, title, data, type, getItem, style,
}) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardTitle}>
        <Loc style={styles.cardTitleText} text={title} />
        <TouchableOpacity onPress={() => navigation.navigate('DAppList', { title, type })}>
          <Loc style={styles.cardButtonText} text="page.dapp.button.seeAll" />
        </TouchableOpacity>
      </View>

      {
        type === 'recent' ? (
          <View style={styles.row}>
            {_.map(data, (item, index) => getItem(item, index))}
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item, index }) => getItem(item, index)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `nest-${index}`}
          />
        )
      }
    </View>
  );
}

DappCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.string,
  getItem: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

DappCard.defaultProps = {
  data: null,
  type: null,
  getItem: () => null,
  style: null,
};
