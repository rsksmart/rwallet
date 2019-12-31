import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import PasscodeModal from './passcode.modal.wrapper';

const PasscodeModals = (props) => {
  const {
    showPasscode, passcodeType, closePasscodeModal, passcodeCallback,
  } = props;

  return (
    <View>
      {(showPasscode && passcodeType && closePasscodeModal) && (
        <PasscodeModal
          type={passcodeType}
          closePasscodeModal={closePasscodeModal}
          passcodeCallback={passcodeCallback}
        />
      )}
    </View>
  );
};

PasscodeModals.propTypes = {
  showPasscode: PropTypes.bool.isRequired,
  passcodeType: PropTypes.string,
  closePasscodeModal: PropTypes.func.isRequired,
  passcodeCallback: PropTypes.func,
};

PasscodeModals.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  passcodeType: null,
  passcodeCallback: null,
};

export default PasscodeModals;
