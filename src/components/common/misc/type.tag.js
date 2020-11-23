import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import color from '../../../assets/styles/color';
import { strings } from '../../../common/i18n';

const styles = StyleSheet.create({
  tag: {
    minWidth: 60,
    paddingHorizontal: 5,
    height: 23,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.vividBlue,
  },
  tagText: {
    color: color.white,
    fontSize: 12,
  },
  testnet: {
    backgroundColor: color.dustyGray,
  },
});

const TypeTag = ({ type }) => (
  <View style={[styles.tag, type === 'Testnet' ? styles.testnet : null]}>
    <Text style={styles.tagText}>{strings(`networkType.${type.toLowerCase()}`)}</Text>
  </View>
);

TypeTag.propTypes = {
  type: PropTypes.string,
};

TypeTag.defaultProps = {
  type: 'Mainnet',
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps, null)(TypeTag);
