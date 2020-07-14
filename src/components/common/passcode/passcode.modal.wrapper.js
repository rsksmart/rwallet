import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePasscodeModal from './passcode.modal.create';
import ResetPasscodeModal from './passcode.modal.reset';
import VerifyPasscodeModal from './passcode.modal.verify';

const PasscodeModalWrapper = (props) => {
  const {
    type, passcode, closePasscodeModal, passcodeCallback, passcodeFallback, setPasscode,
  } = props;
  switch (type) {
    case 'create':
      return (
        <CreatePasscodeModal
          closePasscodeModal={closePasscodeModal}
          passcodeCallback={passcodeCallback}
          setPasscode={setPasscode}
        />
      );
    case 'reset':
      return (
        <ResetPasscodeModal
          closePasscodeModal={closePasscodeModal}
          passcodeCallback={passcodeCallback}
          passcode={passcode}
          setPasscode={setPasscode}
        />
      );
    case 'verify':
      return passcode ? (
        <VerifyPasscodeModal
          closePasscodeModal={closePasscodeModal}
          passcodeCallback={passcodeCallback}
          passcodeFallback={passcodeFallback}
          passcode={passcode}
        />
      ) : null;
    default:
      return null;
  }
};

PasscodeModalWrapper.propTypes = {
  type: PropTypes.oneOf(['create', 'reset', 'verify']).isRequired,
  passcode: PropTypes.string,
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
  passcodeFallback: PropTypes.func,
  setPasscode: PropTypes.func,
};


PasscodeModalWrapper.defaultProps = {
  passcode: undefined,
  passcodeCallback: () => {},
  passcodeFallback: undefined,
  setPasscode: () => {},
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
});

export default connect(mapStateToProps)(PasscodeModalWrapper);
