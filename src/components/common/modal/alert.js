import React, { Component } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableHighlight,
} from 'react-native';

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#9B9B9B',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginTop: 22,
  },
  text: {
    color: '#0B0B0B',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 30,
  },
  line: {
    borderBottomColor: '#DCDCDC',
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  button: {
    color: '#00B520',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      modalVisible: false,
      transparent: true,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  startShow = () => {
    //   alert('开始显示了');
  }

  render() {
    const { animationType, transparent, modalVisible } = this.state;
    const { title, text } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={modalVisible}
        onShow={this.startShow}
      >
        <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ marginHorizontal: 25, backgroundColor: 'white', borderRadius: 5 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>{text}</Text>
            </View>
            <View style={styles.line} />
            <TouchableHighlight onPress={() => {
              this.setModalVisible(false);
            }}
            >
              <Text style={styles.button}>GOT IT</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}
