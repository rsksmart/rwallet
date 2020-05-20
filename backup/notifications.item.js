import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, Switch, Platform,
} from 'react-native';
import color from '../src/assets/styles/color.ts';

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 80,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
});

export default class Item extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = { value: data.selected };
  }

  render() {
    const { data } = this.props;
    const { value } = this.state;
    return (
      <View style={styles.item}>
        <Text style={[styles.title]}>{data.title}</Text>
        <Switch
          trackColor={Platform.OS === 'ios' ? { false: 'gray', true: color.app.theme } : {}}
          value={value}
          onValueChange={(v) => {
            this.setState({ value: v });
            data.selected = v;
          }}
        />
      </View>
    );
  }
}

Item.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
};
