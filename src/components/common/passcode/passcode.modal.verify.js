/* eslint "default-case": "off" */
import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PasscodeModalBase from './passcode.modal.base';

class VerifyPasscodeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.flows = [
      { index: 0, title: 'Type your passcode' },
      { index: 1, title: 'Passcode is incorrected' },
    ];
    this.flowIndex = 0;
    this.title = this.flows[0].title;
    const { closePasscodeModal } = this.props;
    this.closePasscodeModal = closePasscodeModal;
    this.cancelBtnOnPress = this.cancelBtnOnPress.bind(this);
    this.passcodeOnFill = this.passcodeOnFill.bind(this);
  }

  componentDidMount(): void {
    this.passcode = global.passcode;
  }

    cancelBtnOnPress = () => {
    };

    passcodeOnFill = async (input) => {
      let flow = null;
      switch (this.flowIndex) {
        case 0:
        case 1:
          if (input === this.passcode) {
            this.baseModal.resetModal();
            this.closePasscodeModal();
          } else {
            this.flowIndex = 1;
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

VerifyPasscodeModal.propTypes = {
  closePasscodeModal: PropTypes.func.isRequired,
};

export default VerifyPasscodeModal;
