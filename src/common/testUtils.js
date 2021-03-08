import React from 'react';
import PropTypes from 'prop-types';

export function mockComponent(componentName) {
  return (properties) => {
    const { children } = properties;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (<mocked originalComponent={componentName} {...properties}>{children}</mocked>);
  };
}

mockComponent.protoTypes = {
  children: PropTypes.shape({}),
};

mockComponent.defaultProps = {
  children: undefined,
};

export function mockNamedComponents(componentNames) {
  const mockedComponents = {};
  for (let i = 0; i < componentNames.length; i += 1) {
    const name = componentNames[i];
    mockedComponents[name] = mockComponent(name);
  }
  return mockedComponents;
}
