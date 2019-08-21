import React from 'react';
import { StyleSheet } from 'react-native';
import {
  H2,
  Right,
  View,
  Text,
} from 'native-base';

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 5,
  },
  secondaryValue: {
    color: '#8E8E93',
    marginTop: 10,
  },
});

const summaryRow = (props) => {
  const { title, primaryValue, secondaryValue } = props;
  return (
    <View style={styles.rowContainer}>
      <H2>{title}</H2>
      <Right>
        <H2>{primaryValue}</H2>
        <Text style={styles.secondaryValue} numberOfLines={2}>{secondaryValue}</Text>
      </Right>
    </View>
  );
};

summaryRow.propTypes = {
  title: PropTypes.string,
  primaryValue: PropTypes.string,
  secondaryValue: PropTypes.string,
};

summaryRow.defaultProps = {
  title: '',
  primaryValue: '',
  secondaryValue: '',
};

export default summaryRow;
