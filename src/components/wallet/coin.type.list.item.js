import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Text, Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    marginLeft: 20,
    height: 45,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.component.iconList.borderBottomColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 9,
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: color.component.iconList.title.color,
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
        <Image source={data.icon} />
        <View style={[styles.right]}>
          <Text style={[styles.title]}>{data.title}</Text>
          <Switch
            value={value}
            onValueChange={(v) => {
              this.setState({ value: v });
              data.selected = v;
            }}
          />
        </View>
      </View>
    );
  }
}

Item.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    coin: PropTypes.string,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
};
