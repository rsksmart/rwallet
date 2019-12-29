/* eslint "react/jsx-props-no-spreading": "off" */
/* eslint "default-case": "off" */
/* eslint "consistent-return": "off" */
import React from 'react';
import PropTypes from 'prop-types';
import CreatePasscodeModal from './passcode.modal.create';
import ResetPasscodeModal from './passcode.modal.reset';
import VerifyPasscodeModal from './passcode.modal.verify';

const PasscodeModalWrapper = (props) => {
  const { type } = props;
  switch (type) {
    case 'create':
      return <CreatePasscodeModal {...props} />;
    case 'reset':
      return <ResetPasscodeModal {...props} />;
    case 'verify':
      return global.passcode ? <VerifyPasscodeModal {...props} /> : null;
  }
};

PasscodeModalWrapper.propTypes = {
  type: PropTypes.oneOf(['create', 'reset', 'verify']).isRequired,
};

export default PasscodeModalWrapper;
