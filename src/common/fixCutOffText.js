// Oppo A77 - Some texts gets cut-off
// solution: Set default font family
// see https://github.com/facebook/react-native/issues/15114
import React from 'react';
import { Text, Platform } from 'react-native';

const fixCutOffText = () => {
  if (Platform.OS !== 'android') {
    return;
  }

  const oldRender = Text.render;
  Text.render = (...args) => {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Roboto' }, origin.props.style],
    });
  };
};

export default fixCutOffText;
