import React from 'react';
import {
  View,
} from 'react-native';

import { PropTypes } from 'prop-types';

import styles from './styles';

const FormRow = (props) => {
  const { children } = props;
  return (
    <View style={[styles.formRow, props.style]}>
      {children}
    </View>
  );
};

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormRow;
