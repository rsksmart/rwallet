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
import storage from '../../../common/storage';
import Loader from '../misc/loader';
import {
  getClosestStep,
  WRONG_ATTEMPTS_STEPS,
} from './wrongPasscodeUtils';

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
    const { title } = props;
    this.state = {
      title,
      input: '',
      locked: false,
      timer: 0,
      isLoading: true,
    };
    this.onPressButton = this.onPressButton.bind(this);
    this.onDeletePressed = this.onDeletePressed.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.initialize().then(() => this.setState({ isLoading: false }));
  }

  componentWillUnmount() {
    // fixes Warning: Can't perform a React state update on an unmounted component
    this.setState = () => { };
  }

  onPressButton(i) {
    // ignore everything when locked
    const { locked } = this.state;
    if (locked) return;
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

  lock = ({ milliseconds }) => {
    // TODO: register string on translations file
    this.setState({
      input: '',
      title: 'You can try again in',
      locked: true,
      timer: milliseconds,
    });

    // updates timer every 1 second
    const interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1000 })),
      1000,
    );

    setTimeout(() => {
      this.setState({
        title: 'modal.verifyPasscode.type',
        locked: false,
        timer: 0,
      });
      clearInterval(interval);
    }, milliseconds);
  }

  handleWrongPasscode = async () => {
    this.wrongAttemptsCounter += 1;
    storage.setWrongPasscodeCounter(this.wrongAttemptsCounter);

    if (this.wrongAttemptsCounter < WRONG_ATTEMPTS_STEPS.step1.maxAttempts) {
      // still doesn't reach the first step
      this.rejectPasscord('modal.verifyPasscode.incorrect');
      return;
    }
    const { waitingMinutes } = getClosestStep({ numberOfAttempts: this.wrongAttemptsCounter });
    storage.setLastPasscodeAttempt(Date.now());
    this.lock({ milliseconds: waitingMinutes * 1000 * 60 });
  }

  async initialize() {
    this.wrongAttemptsCounter = parseInt(await storage.getWrongPasscodeCounter(), 10) || 0;

    if (this.wrongAttemptsCounter < WRONG_ATTEMPTS_STEPS.step1.maxAttempts) {
      return;
    }
    const lastAttemptTimestamp = parseInt(await storage.getLastPasscodeAttempt(), 10);
    const msSinceLastAttempt = Date.now() - lastAttemptTimestamp;
    const { waitingMinutes } = getClosestStep({ numberOfAttempts: this.wrongAttemptsCounter });
    const milliseconds = waitingMinutes * 1000 * 60 - msSinceLastAttempt;

    if (milliseconds > 0) {
      this.lock({ milliseconds });
    }
  }

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

  renderTitle() {
    const { locked, timer, title } = this.state;

    if (!locked) return <Loc style={[styles.title]} text={title} />;

    const minutes = Math.floor(timer / 60 / 1000).toString().padStart(2, '0');
    const seconds = Math.floor((timer % 60000) / 1000).toString().padStart(2, '0');

    return <Loc style={[styles.title]} text={`${title} ${minutes}:${seconds}`} />;
  }

  render() {
    const {
      cancelBtnOnPress, showCancel, onResetPressed, isShowReset,
    } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader loading={isLoading} />;
    }

    return (
      <View style={[styles.background, styles.container]}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {this.renderTitle()}
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
};

PasscodeModalBase.defaultProps = {
  showCancel: true,
  isShowReset: false,
  cancelBtnOnPress: null,
  onResetPressed: null,
};

export default PasscodeModalBase;
