import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getServerInfo } from '../../../services/serverServices';
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
    this.setState({ isLoading: true });
    this.initialize()
      .then(this.setState({ isLoading: false }))
      .catch((error) => {
        console.error('This error should be reported', { error });
      });
  }

  initialize = async () => {
    const wrongAttemptsStorage = await storage.getWrongPasscodeCounter();
    this.wrongAttemptsCounter = parseInt(wrongAttemptsStorage, 10) || 0;

    if (this.wrongAttemptsCounter < WRONG_ATTEMPTS_STEPS.step1.maxAttempts) {
      return;
    }
    const lastPasscodeStorage = await storage.getLastPasscodeAttempt();
    if (!lastPasscodeStorage || lastPasscodeStorage === '0') {
      return;
    }

    const lastAttemptTimestamp = parseInt(lastPasscodeStorage, 10);
    const serverInfo = await getServerInfo();
    const msSinceLastAttempt = serverInfo.timestamp - lastAttemptTimestamp;
    const { waitingMinutes } = getClosestStep({ numberOfAttempts: this.wrongAttemptsCounter });
    const milliseconds = waitingMinutes * 1000 * 60 - msSinceLastAttempt;

    if (milliseconds > 0) {
      this.lock({ milliseconds });
    }
  }

  lock = ({ milliseconds }) => {
    this.setState({
      locked: true,
      timer: milliseconds,
    });
    this.baseModal.resetModal('modal.verifyPasscode.tryAgainIn');

    // updates timer every 1 second
    const interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1000 })),
      1000,
    );

    setTimeout(() => {
      this.setState({
        locked: false,
        timer: undefined,
        title: 'modal.verifyPasscode.type',
      });
      this.baseModal.resetModal('modal.verifyPasscode.type');
      clearInterval(interval);
    }, milliseconds);
  }

  handleWrongPasscode = async () => {
    this.wrongAttemptsCounter += 1;
    storage.setWrongPasscodeCounter(this.wrongAttemptsCounter);

    if (this.wrongAttemptsCounter < WRONG_ATTEMPTS_STEPS.step1.maxAttempts) {
      // still doesn't reach the first step
      this.baseModal.rejectPasscord('modal.verifyPasscode.incorrect');
      this.setState({ isLoading: false });
    } else {
      const { waitingMinutes } = getClosestStep({ numberOfAttempts: this.wrongAttemptsCounter });
      const serverInfo = await getServerInfo();
      storage.setLastPasscodeAttempt(serverInfo.timestamp);
      this.setState({ isLoading: false });
      this.lock({ milliseconds: waitingMinutes * 1000 * 60 });
    }
  }

  passcodeOnFill = async (input) => {
    this.setState({ isLoading: true });

    const { passcode } = this.props;

    if (input === passcode) {
      this.baseModal.resetModal();
      this.closePasscodeModal();
      clearWrongAttempts();

      if (this.passcodeCallback) {
        this.passcodeCallback();
      }
      this.setState({ isLoading: false });
    } else {
      await this.handleWrongPasscode();
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
