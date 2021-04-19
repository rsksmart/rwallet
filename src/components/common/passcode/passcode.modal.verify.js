import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasscodeModalBase from './passcode.modal.base';

const MAX_ATTEMPTS = 2;

class VerifyPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: 0, title: 'modal.verifyPasscode.type' },
      { index: 1, title: 'modal.verifyPasscode.incorrect' },
    ];
    this.flowIndex = 0;
    this.title = this.flows[0].title;
    const { closePasscodeModal, passcodeCallback, passcodeFallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeFallback = passcodeFallback;
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
    this.wrongAttemptsCounter = 0;
  }

  passcodeOnFill = async (input) => {
    const { passcode } = this.props;
    let flow = null;
    switch (this.flowIndex) {
      case 0:
      case 1:
        if (input === passcode) {
          this.wrongAttemptsCounter = 0;
          this.baseModal.resetModal();
          this.closePasscodeModal();
          if (this.passcodeCallback) {
            this.passcodeCallback();
          }
        } else {
          this.wrongAttemptsCounter += 1;
          if (this.wrongAttemptsCounter >= MAX_ATTEMPTS) {
            this.baseModal.lock();
          } else {
            this.flowIndex = 1;
            flow = _.find(this.flows, { index: this.flowIndex });
            this.baseModal.rejectPasscord(flow.title);
          }
        }
        break;
      default:
    }
  };

  cancelBtnOnPress = () => {
    if (this.passcodeFallback) {
      this.passcodeFallback();
    }
    this.closePasscodeModal();
  };

  render() {
    return (
      <PasscodeModalBase
        ref={(ref) => {
          this.baseModal = ref;
        }}
        passcodeOnFill={this.passcodeOnFill}
        title={this.title}
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
