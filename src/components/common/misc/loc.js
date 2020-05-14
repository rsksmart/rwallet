import React from 'react';
import { Text } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings } from '../../../common/i18n';

/**
 * Loc
 * @param {String} text, i18n key
 * @param {style} style
 * @param {string} caseType, text format(upper/capitalize)
 * @param {object} interpolates, interpolates for translation template
 * @returns element
 */
const Loc = ({
  text, style, caseType, interpolates,
}) => {
  let translation = strings(text, interpolates);
  if (caseType === 'upper') {
    translation = translation.toUpperCase();
  } else if (caseType === 'capitalize') {
    const words = _.split(translation, ' ');
    translation = '';
    _.each(words, (word, index) => {
      translation += _.capitalize(word) + (index === words.length ? '' : ' ');
    });
  }
  return <Text style={style}>{ translation }</Text>;
};

Loc.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  caseType: PropTypes.string,
  interpolates: PropTypes.shape({}),
};

Loc.defaultProps = {
  style: null,
  caseType: undefined,
  interpolates: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(Loc);
