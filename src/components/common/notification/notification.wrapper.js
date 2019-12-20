/* eslint "react/jsx-props-no-spreading": "off" */
// TODO: we need to update JSX props spreading such as {...props} to enhance code readability and to remove eslint exceptions
import React from 'react';
import PropTypes from 'prop-types';

import Alert from './alert';

const NotificationWrapper = (props) => <Alert {...props} />;

NotificationWrapper.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default NotificationWrapper;
