/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';
import common from '../../../common/common';

class ResetPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: 0, title: 'modal.passcode.typeOldPasscode' },
      { index: 1, title: 'modal.passcode.typeNewPasscode' },
      { index: 2, title: 'modal.passcode.confirmNewPasscode' },
      { index: 3, title: 'modal.passcode.oldIncorrect' },
      { index: 4, title: 'modal.passcode.notMatched' },
    ];
    this.flowIndex = 0;
    this.tempPasscode = '';
    this.title = this.flows[0].title;
    const { closePasscodeModal, passcodeCallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
  }

  componentDidMount() {
    this.passcode = global.passcode;
  }

  cancelBtnOnPress = () => {
    this.closePasscodeModal();
  };

  passcodeOnFill = async (input) => {
    let flow = null;
    switch (this.flowIndex) {
      case 0:
      case 3:
        if (input === this.passcode) {
          this.flowIndex = 1;
          flow = _.find(this.flows, { index: this.flowIndex });
          this.baseModal.resetModal(flow.title);
        } else {
          this.flowIndex = 3;
          flow = _.find(this.flows, { index: this.flowIndex });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
      case 1:
        this.tempPasscode = input;
        this.flowIndex = 2;
        flow = _.find(this.flows, { index: this.flowIndex });
        this.baseModal.resetModal(flow.title);
        break;
      case 2:
      case 4:
        if (this.tempPasscode === input) {
          await common.updateInAppPasscode(input);
          this.closePasscodeModal();
          if (this.passcodeCallback) {
            this.passcodeCallback();
          }
        } else {
          this.flowIndex = 4;
          flow = _.find(this.flows, { index: this.flowIndex });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
    }
  };

  render() {
    return (
      <PasscodeModalBase
        ref={(ref) => { this.baseModal = ref; }}
        passcodeOnFill={this.passcodeOnFill}
        cancelBtnOnPress={this.cancelBtnOnPress}
        title={this.title}
      />
    );
  }
}

ResetPasscodeModal.propTypes = {
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
};

ResetPasscodeModal.defaultProps = {
  passcodeCallback: null,
};

export default ResetPasscodeModal;
