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
  searchBar: {
    width: '87%',
    height: 28,
    marginTop: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 16,
    height: 16,
    resizeMode: 'cover',
  },
  searchInputView: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
  },
});

const search = require('../../../assets/images/icon/search.png');

export default function SearchInput({
  placeholder, placeholderTextColor, onChangeText, onSubmit,
}) {
  return (
    <View style={styles.searchBar}>
      <Image style={styles.searchIcon} source={search} />
      <TextInput
        style={styles.searchInputView}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}
SearchInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  placeholder: PropTypes.string.isRequired,
  placeholderTextColor: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmit: PropTypes.func,
};

SearchInput.defaultProps = {
  placeholderTextColor: null,
  onChangeText: () => null,
  onSubmit: () => null,
};
