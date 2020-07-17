import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    color: color.component.tags.color,
  },
  itemView: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: color.lightBlue,
    borderRadius: 5,
    marginTop: 10,
    height: 30,
  },
  disableTag: {
    opacity: 0.3,
  },
});

export default function Tags({
  data, onPress, style, showNumber = true, disableIndexs,
}) {
  const { length } = data;
  const res = [];
  for (let i = 0; i < length; i += 1) {
    let isDisabled = false;
    for (let j = 0; j < disableIndexs.length; j += 1) {
      const disableIndex = disableIndexs[j];
      if (i === disableIndex) {
        isDisabled = true;
        break;
      }
    }

    let text = '';
    if (showNumber) {
      text = `${i + 1}) ${data[i]}`;
    } else {
      text = `${data[i]}`;
    }

    const onTagPress = () => {
      if (onPress) {
        onPress(i);
      }
    };

    res.push(
      <TouchableOpacity
        style={isDisabled ? [styles.itemView, styles.disableTag] : styles.itemView}
        disabled={isDisabled}
        onPress={onTagPress}
        key={i}
      >
        <Text style={styles.item}>{text}</Text>
      </TouchableOpacity>,
    );
  }
  return (
    <View style={[styles.tags, style]}>
      {res}
    </View>
  );
}

Tags.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: PropTypes.arrayOf(PropTypes.shape({})),
  onPress: PropTypes.func,
  showNumber: PropTypes.bool,
  disableIndexs: PropTypes.arrayOf(PropTypes.number),
};

Tags.defaultProps = {
  showNumber: true,
  onPress: null,
  style: null,
  disableIndexs: [],
};
