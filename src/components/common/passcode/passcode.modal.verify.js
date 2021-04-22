import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasscodeModalBase from './passcode.modal.base';
import {
  getClosestStep,
  WRONG_ATTEMPTS_STEPS,
  clearWrongAttempts,
  getTimerString,
} from './wrongPasscodeUtils';
import storage from '../../../common/storage';
import Loader from '../misc/loader';

class VerifyPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: 'modal.verifyPasscode.type',
      isLoading: false,
      locked: false,
    };
    const { closePasscodeModal, passcodeCallback, passcodeFallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeFallback = passcodeFallback;
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = async () => {
    try {
      this.setState({ isLoading: true });
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
    } catch (error) {
      console.error('Unexpected error: ', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  lock = ({ milliseconds }) => {
    // TODO: register string on translations file
    this.baseModal.resetModal('You can try again in: ');
    this.setState({
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
        locked: false,
        timer: undefined,
      });
      this.baseModal.resetModal('modal.verifyPasscode.type');
      clearInterval(interval);
    }, milliseconds);
  }

  handleWrongPasscode = () => {
    this.wrongAttemptsCounter += 1;
    storage.setWrongPasscodeCounter(this.wrongAttemptsCounter);

    if (this.wrongAttemptsCounter < WRONG_ATTEMPTS_STEPS.step1.maxAttempts) {
      // still doesn't reach the first step
      this.baseModal.rejectPasscord('modal.verifyPasscode.incorrect');
      return;
    }
    const { waitingMinutes } = getClosestStep({ numberOfAttempts: this.wrongAttemptsCounter });
    storage.setLastPasscodeAttempt(Date.now());
    this.lock({ milliseconds: waitingMinutes * 1000 * 60 });
  }

  passcodeOnFill = async (input) => {
    const { passcode } = this.props;

    if (input === passcode) {
      this.baseModal.resetModal();
      this.closePasscodeModal();
      clearWrongAttempts();

      if (this.passcodeCallback) {
        this.passcodeCallback();
      }
    } else {
      this.handleWrongPasscode();
    }
  };

  cancelBtnOnPress = () => {
    if (this.passcodeFallback) {
      this.passcodeFallback();
    }
    this.closePasscodeModal();
  };

  render() {
    const {
      title, isLoading, locked, timer,
    } = this.state;
    const timerString = timer ? getTimerString({ milliseconds: timer }) : '';

    if (isLoading) {
      return <Loader loading={isLoading} />;
    }

    return (
      <PasscodeModalBase
        ref={(ref) => {
          this.baseModal = ref;
        }}
        locked={locked}
        passcodeOnFill={this.passcodeOnFill}
        title={title}
        timer={timerString}
        cancelBtnOnPress={this.cancelBtnOnPress}
        showCancel={!!this.passcodeFallback}
      />
    );
  }
}

VerifyPasscodeModal.propTypes = {
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
  passcodeFallback: PropTypes.func,
  passcode: PropTypes.string.isRequired,
};

VerifyPasscodeModal.defaultProps = {
  passcodeCallback: undefined,
  passcodeFallback: undefined,
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
});

export default connect(mapStateToProps)(VerifyPasscodeModal);
