import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ConfirmationPanel from './confirmation.panel';

const Confirmation = (props) => {
  const {
    isShowConfirmation, confirmation, removeConfirmation, confirmationCallback,
  } = props;
  return (
    <View>
      {isShowConfirmation && confirmation && (
      <ConfirmationPanel
        type={confirmation.type}
        title={confirmation.title}
        message={confirmation.message}
        onClosePress={removeConfirmation}
        confirmationCallback={confirmationCallback}
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
  }),
  removeConfirmation: PropTypes.func.isRequired,
  confirmationCallback: PropTypes.func,
};

Confirmation.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  confirmation: null,
  confirmationCallback: null,
};

export default Confirmation;
