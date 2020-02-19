/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';
import common from '../../../common/common';

const STATE_NEW_PASSCODE = 0;
const STATE_CONFIRM_PASSCODE = 1;
const STATE_NOT_MATCHED = 2;

class CreatePasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: STATE_NEW_PASSCODE, title: 'modal.passcode.typeNewPasscode' },
      { index: STATE_CONFIRM_PASSCODE, title: 'modal.passcode.confirmNewPasscode' },
      { index: STATE_NOT_MATCHED, title: 'modal.passcode.notMatched' },
    ];
    this.state = { flowIndex: STATE_NEW_PASSCODE };
    this.tempPasscode = '';
    this.title = this.flows[STATE_NEW_PASSCODE].title;
    const { closePasscodeModal, passcodeCallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.onResetPressed = this.onResetPressed.bind(this);
  }

  onResetPressed() {
    let flow = null;
    this.setState({ flowIndex: STATE_NEW_PASSCODE });
    flow = _.find(this.flows, { index: STATE_NEW_PASSCODE });
    this.baseModal.resetModal(flow.title);
  }

  passcodeOnFill = async (passcode) => {
    const { flowIndex } = this.state;
    let flow = null;
    switch (flowIndex) {
      case STATE_NEW_PASSCODE:
        this.tempPasscode = passcode;
        this.setState({ flowIndex: STATE_CONFIRM_PASSCODE });
        flow = _.find(this.flows, { index: STATE_CONFIRM_PASSCODE });
        this.baseModal.resetModal(flow.title);
        break;
      case STATE_CONFIRM_PASSCODE:
      case STATE_NOT_MATCHED:
        if (this.tempPasscode === passcode) {
          await common.updateInAppPasscode(passcode);
          this.closePasscodeModal();
          if (this.passcodeCallback) {
            this.passcodeCallback();
          }
        } else {
          this.setState({ flowIndex: STATE_NOT_MATCHED });
          flow = _.find(this.flows, { index: STATE_NOT_MATCHED });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
    }
  };

  render() {
    const { flowIndex } = this.state;
    return (
      <PasscodeModalBase
        ref={(ref) => { this.baseModal = ref; }}
        passcodeOnFill={this.passcodeOnFill}
        onResetPressed={this.onResetPressed}
        isShowReset={flowIndex > STATE_NEW_PASSCODE}
        showCancel={false}
        title={this.title}
      />
    );
  }
}

CreatePasscodeModal.propTypes = {
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
};

CreatePasscodeModal.defaultProps = {
  passcodeCallback: null,
};

export default CreatePasscodeModal;
