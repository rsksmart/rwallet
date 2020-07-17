import React from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  pickerView: {
    backgroundColor: color.component.input.backgroundColor,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
  },
  picker: {
    flex: 1,
  },
});

export default function Picker() {
  return (
    <View style={styles.pickerView}>
      <RNPickerSelect
        onValueChange={() => {}}
        items={[
          { label: 'Football', value: 'football' },
          { label: 'Baseball', value: 'baseball' },
          { label: 'Hockey', value: 'hockey' },
        ]}
        style={{
          inputAndroid: {
            backgroundColor: 'transparent',
          },
          iconContainer: {
            top: 20,
            right: 15,
          },
        }}
        Icon={() => <Chevron size={1.5} color="gray" />}
      />
    </View>
  );
}
