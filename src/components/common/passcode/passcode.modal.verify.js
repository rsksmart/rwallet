/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';

class VerifyPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: 0, title: 'modal.verifyPasscode.type' },
      { index: 1, title: 'modal.verifyPasscode.incorrected' },
    ];
    this.flowIndex = 0;
    this.title = this.flows[0].title;
    const { closePasscodeModal, passcodeCallback, passcodeFallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeFallback = passcodeFallback;
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
  }

  componentDidMount() {
    this.passcode = global.passcode;
  }

  passcodeOnFill = async (input) => {
    let flow = null;
    switch (this.flowIndex) {
      case 0:
      case 1:
        if (input === this.passcode) {
          this.baseModal.resetModal();
          this.closePasscodeModal();
          if (this.passcodeCallback) {
            this.passcodeCallback();
          }
        } else {
          this.flowIndex = 1;
          flow = _.find(this.flows, { index: this.flowIndex });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
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
};

VerifyPasscodeModal.defaultProps = {
  passcodeCallback: null,
  passcodeFallback: null,
};

export default VerifyPasscodeModal;
