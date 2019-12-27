import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight, TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

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
    justifyContent: 'center',
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
      attemptFailed: false,
      // changeScreen: false
    };
    this.onPressButton = this.onPressButton.bind(this);
    this.shakeDotsView = this.shakeDotsView.bind(this);
  }

  onPressButton(i) {
    const { pass } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    this.setState((prevState) => ({ passcode: prevState.passcode + i }), () => {
      const { passcode } = this.state;
      if (passcode.length >= 4) {
        if (passcode === pass) {
          this.setState({ passcode: '', attemptFailed: false, modalVisible: false });
        } else {
          this.setState({ attemptFailed: true, modalVisible: true });
          this.shakeDotsView(() => {
            this.setState({ passcode: '' });
          });
        }
      }
    });
  }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible, passcode: '' });
    };

    shakeDotsView = (callback) => this.dotsView.shake(800).then(callback);

    render() {
      const {
        animationType, transparent, modalVisible, passcode,
        attemptFailed,
      } = this.state;
      const buttons = [];
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
          </TouchableOpacity>
        );
        buttons.push(t);
      }
      const dots = [];
      for (let i = 0; i < 4; i += 1) {
        const style = i >= passcode.length ? styles.dot1 : styles.dot2;
        const t = (<View style={[styles.dot, style, { borderColor: color.component.passcodeModal.dot.borderColor }]} key={i} />);
        dots.push(t);
      }

      const { onPress } = this.props;
      if (modalVisible) {
        const modalTitle = (attemptFailed && 'Incorrect Pin') || 'Enter Passcode';
        return (
          <View
            animationType={animationType}
            transparent={transparent}
            style={[styles.background, { position: 'absolute', flex: 1 }]}
          >
            <TouchableHighlight style={styles.container}>
              <View style={{ alignItems: 'center' }}>
                <Loc style={[styles.title]} text={modalTitle} />
                <Animatable.View ref={(ref) => { this.dotsView = ref; }} useNativeDriver style={styles.dotRow}>
                  {dots}
                </Animatable.View>
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
  pass: PropTypes.string.isRequired,
};

PasscodeModal.defaultProps = {
  onPress: null,
};
