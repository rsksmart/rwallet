import React from 'react';
import { StyleSheet } from 'react-native';
import {
  H2,
  H3,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';

import { round } from 'mellowallet/src/utils';
import { conf } from '../../../utils/constants';

const styles = StyleSheet.create({
  detailsSection: {
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  amountDetailsSection: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  amount: {
    textAlign: 'right',
    marginBottom: 10,
  },
  fiatValue: {
    color: '#CCC',
  },
});

const ConfirmationDetails = (props) => {
  const { details } = props;
  return (
    <View style={styles.detailsSection}>
      <H3 adjustsFontSizeToFit>{details.sectionName}</H3>

      <View style={styles.amountDetailsSection}>
        <H2
          style={styles.amount}>{`${details.fiat_unit} ${round(details.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}</H2>
        <H3
          adjustsFontSizeToFit
          style={[styles.amount, styles.fiatValue]}
        >
          {`${details.value} ${details.unit}`}
        </H3>
      </View>
    </View>
  );
};

ConfirmationDetails.propTypes = {
  details: PropTypes.shape({
    sectionName: PropTypes.string,
    fiat_unit: PropTypes.string, // eslint-disable-line camelcase
    fiat_value: PropTypes.string, // eslint-disable-line camelcase
    unit: PropTypes.string,
    value: PropTypes.string,
    decimalPlaces: PropTypes.number,
  }).isRequired,
};

export default ConfirmationDetails;
