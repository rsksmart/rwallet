import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PasscodeModalBase from './passcode.modal.base';
import { clearWrongAttempts } from './wrongPasscodeUtils';

class VerifyPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.title = 'modal.verifyPasscode.type';
    const { closePasscodeModal, passcodeCallback, passcodeFallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeFallback = passcodeFallback;
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
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
      this.baseModal.handleWrongPasscode();
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
