import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { PropTypes } from 'prop-types';
import material from 'mellowallet/native-base-theme/variables/material';
import RecoveryPhraseChip from './RecoveryPhraseChip';


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
  wordsBox: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 3,
    backgroundColor: '#efefef',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

const RecoveryPhraseBox = (props) => {
  const {
    dataSource,
    onRemovePress,
    cancelable,
    boxStyle,
    chipStyle,
  } = props;
  const renderElements = dataSource.map(item => (
    <RecoveryPhraseChip
      key={item.key}
      value={item.value}
      cancelable={cancelable}
      onPress={() => onRemovePress(item.key)}
      chipStyle={chipStyle}
    />
  ));

  return (
    <View style={[styles.wordsBox, boxStyle]}>
      {renderElements}
    </View>
  );
};

RecoveryPhraseBox.propTypes = {
  chipStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
  dataSource: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    value: PropTypes.string,
  })),
  onRemovePress: PropTypes.func,
  cancelable: PropTypes.bool,
  boxStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
      ]),
    )]),
};

RecoveryPhraseBox.defaultProps = {
  chipStyle: undefined,
  dataSource: [],
  cancelable: true,
  onRemovePress: () => null,
  boxStyle: {},
};

export default RecoveryPhraseBox;
