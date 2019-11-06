import React, { Component } from 'react';
import {
  StyleSheet, View, Switch, Text,
} from 'react-native';


const styles = StyleSheet.create({
  item: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  title: {
    flex: 1,
  },
});

export default class SwitchListItem extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = { value };
  }

  render() {
    const { value } = this.state;
    const { title } = this.props;
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Switch
          value={value}
          onValueChange={(v) => {
            this.setState({ value: v });
          }}
        />
      </View>
    );
  }
}
