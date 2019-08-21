import React from 'react';
import { Field } from 'redux-form';
import { PropTypes } from 'prop-types';
import RegularTextInput from '../RegularTextInput';

class RegularFieldTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderInput({ input, meta: { touched, error } }) {
    let hasError = false;
    if (error && touched) {
      hasError = true;
    }
    return (
      <RegularTextInput
        error={hasError}
        {...this.props}
        {...input}
      />
    );
  }

  render() {
    const { name, validations } = this.props;
    return (
      <Field
        name={name}
        component={this.renderInput}
        validate={validations}
      />
    );
  }
}

RegularFieldTextInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RegularFieldTextInput;
