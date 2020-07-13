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
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <CreatePasscodeModal {...props} />;
    case 'reset':
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ResetPasscodeModal {...props} />;
    case 'verify':
      // eslint-disable-next-line react/jsx-props-no-spreading
      return passcode ? <VerifyPasscodeModal {...props} /> : null;
    default:
      return null;
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
