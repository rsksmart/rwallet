/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';
import common from '../../../common/common';

const STATE_OLD_PASSCODE = 0;
const STATE_NEW_PASSCODE = 1;
const STATE_CONFIRM_PASSCODE = 2;
const STATE_OLD_PASSCODE_INCORRECT = 3;
const STATE_NOT_MATCHED = 4;

class ResetPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: STATE_OLD_PASSCODE, title: 'modal.passcode.typeOldPasscode' },
      { index: STATE_NEW_PASSCODE, title: 'modal.passcode.typeNewPasscode' },
      { index: STATE_CONFIRM_PASSCODE, title: 'modal.passcode.confirmNewPasscode' },
      { index: STATE_OLD_PASSCODE_INCORRECT, title: 'modal.passcode.oldIncorrect' },
      { index: STATE_NOT_MATCHED, title: 'modal.passcode.notMatched' },
    ];
    this.state = { flowIndex: STATE_OLD_PASSCODE };
    this.tempPasscode = '';
    this.title = this.flows[STATE_OLD_PASSCODE].title;
    const { closePasscodeModal, passcodeCallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.onStartOverPressed = this.onStartOverPressed.bind(this);
  }

  componentDidMount() {
    this.passcode = global.passcode;
  }

  onStartOverPressed() {
    let flow = null;
    this.setState({ flowIndex: STATE_NEW_PASSCODE });
    flow = _.find(this.flows, { index: STATE_NEW_PASSCODE });
    this.baseModal.resetModal(flow.title);
  }

  cancelBtnOnPress = () => {
    this.closePasscodeModal();
  };

  passcodeOnFill = async (input) => {
    let flow = null;
    const { flowIndex } = this.state;
    switch (flowIndex) {
      case STATE_OLD_PASSCODE:
      case STATE_OLD_PASSCODE_INCORRECT:
        if (input === this.passcode) {
          this.setState({ flowIndex: STATE_NEW_PASSCODE });
          flow = _.find(this.flows, { index: STATE_NEW_PASSCODE });
          this.baseModal.resetModal(flow.title);
        } else {
          this.setState({ flowIndex: STATE_OLD_PASSCODE_INCORRECT });
          flow = _.find(this.flows, { index: STATE_OLD_PASSCODE_INCORRECT });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
      case STATE_NEW_PASSCODE:
        this.tempPasscode = input;
        this.setState({ flowIndex: STATE_CONFIRM_PASSCODE });
        flow = _.find(this.flows, { index: STATE_CONFIRM_PASSCODE });
        this.baseModal.resetModal(flow.title);
        break;
      case STATE_CONFIRM_PASSCODE:
      case STATE_NOT_MATCHED:
        if (this.tempPasscode === input) {
          await common.updateInAppPasscode(input);
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
    const isShowStartOver = flowIndex === STATE_CONFIRM_PASSCODE || flowIndex === STATE_NOT_MATCHED;
    return (
      <PasscodeModalBase
        ref={(ref) => { this.baseModal = ref; }}
        passcodeOnFill={this.passcodeOnFill}
        cancelBtnOnPress={this.cancelBtnOnPress}
        onStartOverPressed={this.onStartOverPressed}
        isShowStartOver={isShowStartOver}
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
