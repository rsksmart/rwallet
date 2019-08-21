import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import {
  Icon,
  Item,
  Picker,
} from 'native-base';

import styles from './styles';
import ActionHeader from '../ActionHeader';

const { width } = Dimensions.get('window');

const defaultStyles = StyleSheet.create({
  picker: {
    height: 50,
    marginRight: 10,
    paddingRight: 10,
  },
  block: {
    width,
  },
});

class FormPicker extends React.PureComponent {
  header = (backAction, headerLabel) => (
    <ActionHeader
      title={headerLabel}
      backAction={backAction}
    />
  );

  render() {
    const { children, headerLabel, enabled } = this.props;
    return (
      <Item
        picker
        style={[styles.item, this.props.style]}
      >
        <Picker
          style={[defaultStyles.picker, this.props.block && Platform.OS === 'ios' && defaultStyles.block]}
          enabled={enabled}
          mode="dropdown"
          iosIcon={<Icon name="keyboard-arrow-down" />}
          placeholderStyle={styles.placeHolder}
          placeholderIconColor="#7D7C7F"
          renderHeader={backAction => this.header(backAction, headerLabel)}
          {...this.props}
        >
          {children}
        </Picker>
      </Item>
    );
  }
}

export default FormPicker;
