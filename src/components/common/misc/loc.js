import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings } from '../../../common/i18n';

const Loc = ({
  text, style, prefix, suffix, caseType,
}) => {
  const pre = prefix === '&space&' ? ' ' : prefix;
  const suf = suffix === '&space&' ? ' ' : suffix;
  let translation = strings(text);
  if (caseType === 'upper') {
    translation = translation.toUpperCase();
  }
  return <Text style={style}>{pre + translation + suf}</Text>;
};

Loc.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  caseType: PropTypes.string,
};

Loc.defaultProps = {
  style: null,
  prefix: '',
  suffix: '',
  caseType: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(Loc);
