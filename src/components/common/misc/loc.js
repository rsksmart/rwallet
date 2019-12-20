import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings, isContainTranslation } from '../../../common/i18n';

const Loc = ({ text, style }) => {
  const translation = isContainTranslation(text) ? strings(text) : text;
  return <Text style={style}>{translation}</Text>;
};

Loc.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.arrayOf(PropTypes.shape({})),
};

Loc.defaultProps = {
  style: null,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(Loc);
