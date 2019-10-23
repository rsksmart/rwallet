import React, { Component } from 'react';
import {
  Modal, View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.component.touchSensorModal.backgroundColor,
  },
  panel: {
    marginHorizontal: 25,
    alignItems: 'center',
    backgroundColor: color.component.touchSensorModal.panel.backgroundColor,
    borderRadius: 5,
  },
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: color.component.touchSensorModal.color,
    marginTop: 30,
  },
  finger: {
    marginTop: 45,
    marginBottom: 100,
  },
});

export default class TouchSensorModal extends Component {
  constructor(props) {
    super(props); // 这一句不能省略，照抄即可
    this.state = {
      animationType: 'fade', // none slide fade
      modalVisible: false, // 模态场景是否可见
      transparent: true, // 是否透明显示
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
      return (
        <Modal
          animationType={animationType}
          transparent={transparent}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
          onShow={this.startShow}
        >
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(false);
            }}
            style={styles.container}
          >
            <View style={styles.panel}>
              <Text style={styles.title}>Touch Sensor</Text>
              <Image style={styles.finger} source={require('../../../assets/images/misc/finger.png')} />
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }
}
