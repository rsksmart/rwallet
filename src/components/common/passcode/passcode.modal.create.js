/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';
import common from '../../../common/common';

class CreatePasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: 0, title: 'modal.passcode.typeNewPasscode' },
      { index: 1, title: 'modal.passcode.confirmNewPasscode' },
      { index: 2, title: 'modal.passcode.notMatched' },
    ];
    this.state = {
      flowIndex: 0,
    };
    this.tempPasscode = '';
    this.title = this.flows[0].title;
    const { closePasscodeModal, passcodeCallback, passcodeFallback } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.passcodeCallback = passcodeCallback;
    this.passcodeFallback = passcodeFallback;
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
    this.onStartOverPressed = this.onStartOverPressed.bind(this);
  }

  onStartOverPressed() {
    let flow = null;
    this.setState({ flowIndex: 0 });
    flow = _.find(this.flows, { index: 0 });
    this.baseModal.resetModal(flow.title);
  }

  cancelBtnOnPress = () => {
    if (this.passcodeFallback) {
      this.passcodeFallback();
    }
    this.closePasscodeModal();
  };

  passcodeOnFill = async (passcode) => {
    const { flowIndex } = this.state;
    let flow = null;
    switch (flowIndex) {
      case 0:
        this.tempPasscode = passcode;
        this.setState({ flowIndex: 1 });
        flow = _.find(this.flows, { index: 1 });
        this.baseModal.resetModal(flow.title);
        break;
      case 1:
      case 2:
        if (this.tempPasscode === passcode) {
          await common.updateInAppPasscode(passcode);
          this.closePasscodeModal();
          if (this.passcodeCallback) {
            this.passcodeCallback();
          }
        } else {
          this.setState({ flowIndex: 2 });
          flow = _.find(this.flows, { index: 2 });
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
        cancelBtnOnPress={this.cancelBtnOnPress}
        onStartOverPressed={this.onStartOverPressed}
        showCancel={!!this.passcodeFallback}
        isShowStartOver={flowIndex > 0}
        title={this.title}
      />
    );
  }
}

CreatePasscodeModal.propTypes = {
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
  passcodeFallback: PropTypes.func,
};

CreatePasscodeModal.defaultProps = {
  passcodeCallback: null,
  passcodeFallback: null,
};

export default CreatePasscodeModal;
