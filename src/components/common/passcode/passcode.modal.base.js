import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';
import Loc from '../misc/loc';
import references from '../../../assets/references';

const buttonSize = 75;
const dotSize = 13;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
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
    marginTop: 25,
    marginBottom: 45,
    flexDirection: 'row',
  },
  dot: {
    marginHorizontal: 10,
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    borderWidth: 2,
  },
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
    width: 320,
  },
  operationButton: {
    position: 'absolute',
    width: buttonSize,
    height: buttonSize,
    bottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBottomButton: {
    left: 16,
  },
  deleteButton: {
    right: 16,
  },
  buttonText: {
    fontFamily: fontFamily.AvenirMedium,
    fontSize: 19,
    color: color.component.passcodeModal.number.color,
  },
  number: {
    color: color.component.passcodeModal.number.color,
    fontSize: 35,
  },
});

class PasscodeModalBase extends PureComponent {
  constructor(props) {
    super(props);
    const { title, subtitle } = props;
    this.state = {
      title,
      subtitle,
      input: '',
    };
    this.onPressButton = this.onPressButton.bind(this);
    this.onDeletePressed = this.onDeletePressed.bind(this);
  }

  onPressButton(i) {
    const { passcodeOnFill } = this.props;
    this.setState((prevState) => ({ input: prevState.input + i }), () => {
      const { input } = this.state;
      if (input.length >= 4) {
        passcodeOnFill(input);
      }
    });
  }

  onDeletePressed() {
    const { input } = this.state;
    if (input.length === 0) {
      return;
    }
    const newInput = input.substr(0, input.length - 1);
    this.setState({ input: newInput });
  }

  resetModal = (title) => {
    this.setState({ input: '', title: title || '' });
  };

  rejectPasscord = (title) => {
    this.setState({ input: '', title }, () => this.dotsView.shake(800));
  };

  renderButtons() {
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
    return buttons;
  }

  renderDots() {
    const { input } = this.state;
    const dots = [];
    for (let i = 0; i < 4; i += 1) {
      const style = i >= input.length ? {} : styles.dot2;
      const t = (<View style={[styles.dot, style, { borderColor: color.component.passcodeModal.dot.borderColor }]} key={i} />);
      dots.push(t);
    }
    return dots;
  }

  render() {
    const {
      title, subtitle,
    } = this.state;
    const {
      cancelBtnOnPress, showCancel, onResetPressed, isShowReset,
    } = this.props;

    return (
      <View style={[styles.background, styles.container]}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Loc style={[styles.title]} text={title} />
          {subtitle.length && <Loc style={[styles.title]} text={subtitle} />}
          <Animatable.View ref={(ref) => { this.dotsView = ref; }} useNativeDriver style={styles.dotRow}>
            {this.renderDots()}
          </Animatable.View>
          <View style={styles.buttonView}>
            {isShowReset && (
              <TouchableOpacity style={[styles.operationButton, styles.leftBottomButton]} onPress={onResetPressed}>
                <Image source={references.images.passcodeReset} />
              </TouchableOpacity>
            )}
            {showCancel && (
              <TouchableOpacity style={[styles.operationButton, styles.leftBottomButton]} onPress={cancelBtnOnPress}>
                <Image source={references.images.passcodeCancel} />
              </TouchableOpacity>
            )}
            {this.renderButtons()}
            <TouchableOpacity style={[styles.operationButton, styles.deleteButton]} onPress={this.onDeletePressed}>
              <Image source={references.images.passcodeDelete} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

PasscodeModalBase.propTypes = {
  title: PropTypes.string.isRequired,
  passcodeOnFill: PropTypes.func.isRequired,
  cancelBtnOnPress: PropTypes.func,
  onResetPressed: PropTypes.func,
  showCancel: PropTypes.bool,
  isShowReset: PropTypes.bool,
  subtitle: PropTypes.string,
};

PasscodeModalBase.defaultProps = {
  showCancel: true,
  isShowReset: false,
  cancelBtnOnPress: null,
  onResetPressed: null,
  subtitle: '',
};

export default PasscodeModalBase;
