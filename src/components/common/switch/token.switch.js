import React from 'react';
import {
  View, Image, Text, Switch, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  rowTitle: {
    marginLeft: 20,
    flex: 1,
  },
});

export default function TokenSwitch(props) {
  const {
    style, icon, name, onSwitchValueChanged, disabled, value, iconStyle, switchStyle,
  } = props;
  return (
    <View style={style}>
      <Image source={icon} style={iconStyle} />
      <Text style={styles.rowTitle}>{name}</Text>
      <Switch
        style={switchStyle}
        value={value}
        onValueChange={onSwitchValueChanged}
        disabled={disabled}
      />
    </View>
  );
}

TokenSwitch.propTypes = {
  style: PropTypes.oneOfType(PropTypes.array, PropTypes.shape({})),
  iconStyle: PropTypes.oneOfType(PropTypes.array, PropTypes.shape({})),
  switchStyle: PropTypes.oneOfType(PropTypes.array, PropTypes.shape({})),
  icon: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.bool,
  onSwitchValueChanged: PropTypes.func,
  disabled: PropTypes.bool,
};

TokenSwitch.defaultProps = {
  style: undefined,
  iconStyle: undefined,
  switchStyle: undefined,
  icon: '',
  name: '',
  value: false,
  onSwitchValueChanged: () => null,
  disabled: false,
};
