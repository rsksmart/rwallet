import React, { PureComponent } from 'react';
import {
  StyleSheet,
} from 'react-native';
import material from 'mellowallet/native-base-theme/variables/material';
import { PropTypes } from 'prop-types';
import { View, Text } from 'native-base';
import SmoothPinCodeInput from 'mellowallet/src/components/FormInputs/SmoothPinCodeInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderBottomWidth: 2,
    margin: 10,
    borderColor: material.brandPrimary,
  },
  focusedCell: {
    borderColor: '#5A20BB',
  },
});

class InputPin extends PureComponent {
  render() {
    const {
      label,
      labelStyle,
      reference,
    } = this.props;

    return (
      <View>
        <Text style={labelStyle}>{label}</Text>
        <View style={styles.container}>
          <SmoothPinCodeInput
            ref={reference}
            autoFocus
            password
            mask="﹡"
            codeLength={5}
            cellSpacing={10}
            cellStyle={styles.cell}
            cellStyleFocused={styles.focusedCell}
            {...this.props}
          />
        </View>
      </View>
    );
  }
}

InputPin.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

InputPin.defaultProps = {
  label: '',
  labelStyle: {},
};


export default InputPin;
