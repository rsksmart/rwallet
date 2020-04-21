import React, { Component } from 'react';
import {
  Modal, View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '../../../assets/styles/color.ts';
import flex from '../../../assets/styles/layout.flex';
import space from '../../../assets/styles/space';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: color.white,
    borderRadius: 5,
    marginHorizontal: 45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleView: {
    borderBottomColor: color.seporatorLineLightGrey,
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
  ButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: color.seporatorLineLightGrey,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 15,
  },
  button: {
    minWidth: 95,
  },
});

class SelectionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedIndex: 0,
      currentIndex: 0,
    };
  }

  onItemSelected = (index) => {
    this.setState({ currentIndex: index });
  }

  show = () => {
    const { selectedIndex } = this.state;
    this.setState({ visible: true, currentIndex: selectedIndex });
  }

  onCancelPressed = () => {
    this.setState({ visible: false });
  }

  onConfirmPressed = () => {
    const { currentIndex } = this.state;
    const { onSelected } = this.props;
    onSelected(currentIndex);
    this.setState({ visible: false, selectedIndex: currentIndex });
  }

  render() {
    const { items, title } = this.props;
    const { visible, currentIndex } = this.state;
    return (
      <Modal visible={visible} transparent>
        <View style={styles.container}>
          <View style={styles.panel}>
            <View style={[styles.row, styles.titleView]}><Text style={styles.title}>{title}</Text></View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={items}
              extraData={currentIndex}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.row, styles.listRow]}
                  onPress={() => { this.onItemSelected(index); }}
                >
                  <Text style={[flex.flex1, currentIndex === index ? styles.selectedColor : null]}>{item}</Text>
                  { currentIndex === index && (
                    <Ionicons style={styles.selectedColor} name="ios-checkmark" size={30} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.ButtonsView}>
              <TouchableOpacity style={styles.button} onPress={this.onCancelPressed}>
                <Loc style={[styles.buttonText]} text="button.cancel" caseType="upper" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, space.marginLeft_35]} onPress={this.onConfirmPressed}>
                <Loc style={[styles.buttonText]} text="button.ok" caseType="upper" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

SelectionModal.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  onSelected: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

SelectionModal.defaultProps = {
  items: undefined,
};

export default SelectionModal;
