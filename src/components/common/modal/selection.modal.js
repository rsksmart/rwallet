import React, { Component } from 'react';
import {
  Modal, View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '../../../assets/styles/color.ts';
import flex from '../../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 45,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleView: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Avenir-Heavy',
    color: color.black,
    marginVertical: 14,
  },
  listRow: {
    height: 50,
    marginHorizontal: 20,
  },
  selectedColor: {
    color: color.lightGreen,
  },
});

class SelectionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onPressed = (index) => {
    const { onChange, selectIndex } = this.props;
    if (selectIndex !== index && onChange) {
      this.setState({ visible: false });
      onChange(index);
    }
  }

  show = () => {
    this.setState({ visible: true });
  }

  render() {
    const { items, selectIndex, title } = this.props;
    const { visible } = this.state;
    return (
      <Modal visible={visible} transparent>
        <TouchableOpacity style={styles.container} onPress={() => { this.setState({ visible: false }); }}>
          <View style={styles.panel}>
            <View style={[styles.row, styles.titleView]}><Text style={styles.title}>{title}</Text></View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={items}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.row, styles.listRow]}
                  onPress={() => { this.onPressed(index); }}
                >
                  <Text style={[flex.flex1, selectIndex === index ? styles.selectedColor : null]}>{item}</Text>
                  { selectIndex === index && (
                    <Ionicons style={styles.selectedColor} name="ios-checkmark" size={30} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

SelectionModal.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  selectIndex: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

SelectionModal.defaultProps = {
  items: undefined,
  selectIndex: 0,
};

export default SelectionModal;
