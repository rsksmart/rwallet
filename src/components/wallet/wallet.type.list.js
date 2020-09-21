import React from 'react';
import {
  StyleSheet, View, FlatList, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';
import Loc from '../common/misc/loc';
import color from '../../assets/styles/color';

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
    paddingBottom: 13,
    borderBottomColor: color.grayD5,
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: this.codGray,
    fontSize: 16,
    flex: 1,
  },
  text: {
    color: color.tundora,
    fontSize: 15,
    flex: 1,
    marginTop: 9,
  },
  chevron: {
    color: this.grayD5,
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


export default function WalletTypeList({ data, style }) {
  return (
    <FlatList
      style={style}
      data={data}
      renderItem={({ item }) => (
        <Item
          title={item.title}
          text={item.text}
          icon={item.icon}
          onPress={item.onPress}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

WalletTypeList.propTypes = Item.propTypes;
