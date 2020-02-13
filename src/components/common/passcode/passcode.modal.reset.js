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
    this.state = {
      flowIndex: 0,
    };
    this.tempPasscode = '';
    this.title = this.flows[0].title;
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
    this.setState({ flowIndex: 1 });
    flow = _.find(this.flows, { index: 1 });
    this.baseModal.resetModal(flow.title);
  }

  cancelBtnOnPress = () => {
    this.closePasscodeModal();
  };

  passcodeOnFill = async (input) => {
    let flow = null;
    const { flowIndex } = this.state;
    switch (flowIndex) {
      case 0:
      case 3:
        if (input === this.passcode) {
          this.setState({ flowIndex: 1 });
          flow = _.find(this.flows, { index: 1 });
          this.baseModal.resetModal(flow.title);
        } else {
          this.setState({ flowIndex: 3 });
          flow = _.find(this.flows, { index: 3 });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
      case 1:
        this.tempPasscode = input;
        this.setState({ flowIndex: 2 });
        flow = _.find(this.flows, { index: 2 });
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
          this.setState({ flowIndex: 4 });
          flow = _.find(this.flows, { index: 4 });
          this.baseModal.rejectPasscord(flow.title);
        }
        break;
    }
  };

  render() {
    const { flowIndex } = this.state;
    const isShowStartOver = flowIndex === 2 || flowIndex === 4;
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
