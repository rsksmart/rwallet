import React from 'react';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import { RNChipView } from 'react-native-chip-view';
import material from 'mellowallet/native-base-theme/variables/material';


const styles = StyleSheet.create({
  chipContainer: {
    margin: 4,
    padding: 4,
    backgroundColor: material.toolbarDefaultBg,
  },
  chipTitle: {
    fontSize: 14,
    color: material.toolbarBtnColor,
  },
});

const RecoveryPhraseChip = (props) => {
  const { chipStyle, value } = props;
  return (
    <RNChipView
      title={value}
      avatar={false}
      containerStyle={chipStyle}
      titleStyle={styles.chipTitle}
      {...props}
    />
  );
};

RecoveryPhraseChip.propTypes = {
  value: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  cancelable: PropTypes.bool,
  chipStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
};

RecoveryPhraseChip.defaultProps = {
  cancelable: true,
  chipStyle: styles.chipContainer,
  onPress: () => null,
};

export default RecoveryPhraseChip;
