import React from 'react';
import {
  StyleSheet, View, TextInput, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';

const styles = StyleSheet.create({
  textInput: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 15,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

const search = require('../../../assets/images/icon/search.png');

export default function SearchInput({ placeholder }) {
  return (
    <View style={styles.textInput}>
      <View style={{ flexDirection: 'row' }}>
        <Image style={{ marginTop: 7 }} source={search} />
        <TextInput style={{ flex: 1 }} placeholder={placeholder} />
      </View>
    </View>
  );
}
SearchInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  placeholder: PropTypes.string.isRequired,
};
