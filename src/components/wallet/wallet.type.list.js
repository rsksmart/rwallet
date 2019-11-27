import React from 'react';
import {
  StyleSheet, View, FlatList, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';
import Loc from '../common/misc/loc';

const styles = StyleSheet.create({
  item: {
    paddingLeft: 10,
    flexDirection: 'row',
    paddingTop: 15,
  },
  iconView: {
    marginTop: 5,
  },
  right: {
    marginLeft: 20,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
    borderBottomColor: '#D5D5D5',
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: '#0B0B0B',
    fontSize: 16,
    flex: 1,
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    flex: 1,
  },
  chevron: {
    color: '#D5D5D5',
  },
});

function Item({
  title, text, icon, onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.iconView}>
          {icon}
        </View>
        <View style={[styles.right]}>
          <View style={styles.textView}>
            <Loc style={[styles.title]} text={title} />
            <Loc style={[styles.text]} text={text} />
          </View>
          <Icon name="chevron-small-right" size={35} style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
};

Item.defaultProps = {
  icon: null,
  title: null,
  text: null,
  onPress: null,
};


export default function WalletTypeList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Item
          title={item.title}
          text={item.text}
          icon={item.icon}
          onPress={item.onPress}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

WalletTypeList.propTypes = Item.propTypes;
