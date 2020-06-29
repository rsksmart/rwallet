import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ConfirmationPanel from './confirmation.panel';

const Confirmation = (props) => {
  const {
    isShowConfirmation, confirmation, removeConfirmation, confirmationCallback, confirmationCancelCallback,
  } = props;
  return (
    <View>
      {isShowConfirmation && confirmation && (
      <ConfirmationPanel
        type={confirmation.type}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        onClosePress={removeConfirmation}
        confirmationCallback={confirmationCallback}
        confirmationCancelCallback={confirmationCancelCallback}
      />
      )}
    </View>
  );
};

Confirmation.propTypes = {
  isShowConfirmation: PropTypes.bool.isRequired,
  confirmation: PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
  }),
  removeConfirmation: PropTypes.func.isRequired,
  confirmationCallback: PropTypes.func,
  confirmationCancelCallback: PropTypes.func,
};

Confirmation.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  confirmation: null,
  confirmationCallback: null,
  confirmationCancelCallback: null,
};

export default Confirmation;
