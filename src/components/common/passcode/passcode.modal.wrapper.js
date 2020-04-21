/* eslint "react/jsx-props-no-spreading": "off" */
/* eslint "default-case": "off" */
/* eslint "consistent-return": "off" */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePasscodeModal from './passcode.modal.create';
import ResetPasscodeModal from './passcode.modal.reset';
import VerifyPasscodeModal from './passcode.modal.verify';

const PasscodeModalWrapper = (props) => {
  const { type, passcode } = props;
  switch (type) {
    case 'create':
      return <CreatePasscodeModal {...props} />;
    case 'reset':
      return <ResetPasscodeModal {...props} />;
    case 'verify':
      return passcode ? <VerifyPasscodeModal {...props} /> : null;
  }
};

PasscodeModalWrapper.propTypes = {
  type: PropTypes.oneOf(['create', 'reset', 'verify']).isRequired,
  passcode: PropTypes.string,
};


PasscodeModalWrapper.defaultProps = {
  passcode: undefined,
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
});

export default connect(mapStateToProps)(PasscodeModalWrapper);
