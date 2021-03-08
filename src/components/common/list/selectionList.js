import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, Text, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  item: {
    borderBottomColor: color.component.iconTwoTextList.borderBottomColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 30,
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: color.component.selectionList.color,
  },
  check: {
    marginRight: 10,
    color: color.app.theme,
  },
});

function Item({ title, selected, onPress }) {
  let arrow = null;
  if (selected) {
    arrow = <AntDesign style={styles.check} name="check" size={20} />;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={[styles.title]}>{title}</Text>
          {arrow}
        </View>
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
};

Item.defaultProps = {
  selected: false,
  onPress: null,
};

export default class SelectionList extends Component {
  constructor(props) {
    super(props);
    const { selected } = this.props;
    this.state = {
      selectedIndex: selected,
    };
    this.onPress = this.onPress.bind(this);
  }

  onPress(index) {
    const { onChange } = this.props;
    this.setState({ selectedIndex: index });
    if (onChange) {
      onChange(index);
    }
  }

  render() {
    const { selectedIndex } = this.state;
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        extraData={this.state}
        renderItem={({ item, index }) => {
          let selected = false;
          if (selectedIndex === index) {
            selected = true;
          }
          return (
            <Item
              title={item.title}
              onPress={() => {
                this.onPress(index);
              }}
              selected={selected}
            />
          );
        }}
        keyExtractor={() => `${Math.random()}`}
      />
    );
  }
}

SelectionList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Item.propTypes)).isRequired,
  onChange: PropTypes.func,
  selected: PropTypes.number,
};

SelectionList.defaultProps = {
  onChange: null,
  selected: 0,
};
