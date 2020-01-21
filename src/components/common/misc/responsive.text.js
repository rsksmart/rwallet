import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

// https://github.com/facebook/react-native/issues/20906
// magic number, estimated value, fontSize = fontWidth * FONT_SIZE_TIMES;
const FONT_SIZE_TIMES = 1.7;

/**
 * getFontSize, calculate fit font size in limited width
 * @param {*} width, limited width
 * @param {*} length, text length
 * @param {*} maxFontSize
 */
const getFontSize = (width, length, maxFontSize) => {
  let fontSize = Math.floor(width / length);
  fontSize = Math.min(FONT_SIZE_TIMES * fontSize, maxFontSize);
  return fontSize;
};

const styles = StyleSheet.create({
  textView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    includeFontPadding: false,
  },
});

// ResponsiveText, fontSize will calculate by text length again
// The letterSpacing style will be ommited, because fixed letterSpacing apply to varible font size is not suitable.
export default class ResponsiveText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: 0,
      // If fontSize is adjusted, isAdjusted will be set to true, then layout will not be calculated again.
      layoutWidth: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { children, maxFontSize, suffixElementWidth } = nextProps;
    const { layoutWidth } = this.state;
    // If layout isn't change, but children or style is change, calculate font size again.
    const fontSize = getFontSize(layoutWidth - suffixElementWidth, children.length, maxFontSize);
    this.setState({ fontSize });
  }

  onLayout = (event) => {
    const { children, suffixElementWidth, maxFontSize } = this.props;
    const { width: layoutWidth } = event.nativeEvent.layout;
    // layoutWidth - suffixElementWidth is the width text component can use actually
    const fontSize = getFontSize(layoutWidth - suffixElementWidth, children.length, maxFontSize);
    this.setState({ fontSize, layoutWidth });
  }

  render() {
    const {
      children, layoutStyle, fontStyle, suffixElement,
    } = this.props;
    const { fontSize } = this.state;
    const text = fontSize === 0 ? null : (
      <Text style={[styles.text, fontStyle, { fontSize }]}>
        {children}
      </Text>
    );
    return (
      <View onLayout={this.onLayout} style={[layoutStyle, styles.textView]}>
        {text}
        {suffixElement}
      </View>
    );
  }
}

ResponsiveText.propTypes = {
  children: PropTypes.string,
  maxFontSize: PropTypes.number.isRequired,
  layoutStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  fontStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // suffixElement, the element after text component
  suffixElement: PropTypes.element,
  // the width suffixElement occupy
  suffixElementWidth: PropTypes.number,
};

ResponsiveText.defaultProps = {
  children: null,
  layoutStyle: null,
  fontStyle: null,
  suffixElement: null,
  suffixElementWidth: 0,
};
