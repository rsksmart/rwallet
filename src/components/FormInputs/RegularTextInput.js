import React from 'react';
import {
  Input,
  Item,
  Icon,
} from 'native-base';

import styles from './styles';

const regularTextInput = props => (
  <Item
    regular
    error={props.error}
    style={[styles.item, props.style]}
  >
    <Input
      placeholderStyle={styles.placeHolder}
      {...props}
    />
    {props.error && <Icon name="error" />}
  </Item>
);


export default regularTextInput;
