import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';

const buttonSize = 75;
const dotSize = 13;

const styles = StyleSheet.create({
  background: {
    backgroundColor: color.component.passcodeModal.backgroundColor,
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: color.component.passcodeModal.title.color,
  },
  dotRow: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  dot: {
    marginHorizontal: 5,
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    borderColor: color.component.passcodeModal.dot.borderColor,
    borderWidth: 2,
  },
  dot1: {},
  dot2: {
    backgroundColor: color.component.passcodeModal.dot2.backgroundColor,
  },
  button: {
    borderColor: color.component.passcodeModal.button.borderColor,
    borderWidth: 2,
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    marginHorizontal: 15,
    marginVertical: 7,
    alignItems: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    right: 40,
  },
  cancel: {
    fontSize: 18,
    color: color.component.passcodeModal.cancel.color,
  },
  number: {
    color: color.component.passcodeModal.number.color,
    fontSize: 35,
  },
  char: {
    color: color.component.passcodeModal.char.color,
    fontSize: 13,
    letterSpacing: 1,
  },
});

export default class PasscodeModal extends Component {
  constructor(props) {
    super(props); // 这一句不能省略，照抄即可
    this.state = {
      animationType: 'fade',
      modalVisible: false,
      transparent: true,
      passcode: '',
    };
    this.onPressButton = this.onPressButton.bind(this);
  }

  onPressButton(i) {
    let { passcode } = this.state;
    passcode += i;
    this.setState({ passcode });
    if (passcode.length >= 4) {
      const { onFill } = this.props;
      // User control visible,
      // this.setModalVisible(false);
      if (onFill) {
        onFill(passcode);
      }
      this.setState({ passcode: '' });
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible, passcode: '' });
  }

  startShow = () => {}

  render() {
    const {
      animationType, transparent, modalVisible, passcode,
    } = this.state;
    const buttons = [];
    const chars = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', ''];
    for (let i = 0; i < 10; i += 1) {
      const t = (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.onPressButton((i + 1) % 10);
          }}
          key={i}
        >
          <Text style={styles.number}>{(i + 1) % 10}</Text>
          <Text style={styles.char}>{chars[i]}</Text>
        </TouchableOpacity>
      );
      buttons.push(t);
    }
    const dots = [];
    for (let i = 0; i < 4; i += 1) {
      const style = i >= passcode.length ? styles.dot1 : styles.dot2;
      const t = (<View style={[styles.dot, style]} key={i} />);
      dots.push(t);
    }

    const { onPress } = this.props;
    if (modalVisible) {
      return (
        <View
          animationType={animationType}
          transparent={transparent}
          style={[styles.background, { position: 'absolute', flex: 1 }]}
        >
          <TouchableHighlight style={styles.container}>
            <View style={{ alignItems: 'center' }}>
              <Loc style={[styles.title]} text="Enter Passcode" />
              <View style={styles.dotRow}>
                {dots}
              </View>
              <View style={styles.buttonView}>
                {buttons}
              </View>
              <View style={{ width: '100%' }}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setModalVisible(false);
                    if (onPress) {
                      onPress();
                    }
                  }}
                >
                  <Text style={styles.cancel}><Loc style={[styles.title]} text="Cancel" /></Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  }
}

PasscodeModal.propTypes = {
  onPress: PropTypes.func,
  onFill: PropTypes.func,
};

PasscodeModal.defaultProps = {
  onPress: null,
  onFill: null,
};
