import _ from 'lodash';
import React, { Component } from 'react';
import {
  Text, View, Platform, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

// https://github.com/facebook/react-native/issues/20906
// magic number, estimated value, fontSize = fontWidth * FONT_SIZE_TIMES;
const FONT_SIZE_TIMES = 1.7;
const DEFAULT_MAX_FONT_SIZE = 35;

/**
 * getFontSize, calculate fit font size in limited width
 * @param {*} width, limited width
 * @param {*} length, text length
 * @param {*} maxFontSize
 * @param {*} letterSpacing
 */
const getFontSize = (width, length, maxFontSize, letterSpacing) => {
  let restWidth = width;
  if (_.isNumber(letterSpacing)) {
    restWidth -= letterSpacing;
  }
  let fontSize = Math.floor(restWidth / length);
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
export default class ResponsiveText extends Component {
  // calculate fontStyle, layoutStyle, maxFontSize, letterSpacing with style param
  static calculateStyles(style) {
    if (!(_.isArray(style) || _.isObject(style))) {
      return { fontStyle: null, layoutStyle: null, maxFontSize: DEFAULT_MAX_FONT_SIZE };
    }
    const isArray = _.isArray(style);
    let mergedStyle = {};
    if (isArray) {
      _.each(style, (item) => {
        mergedStyle = _.merge(mergedStyle, item);
      });
    } else {
      mergedStyle = style;
    }
    const keys = Object.keys(mergedStyle);
    const fontStyle = {};
    const layoutStyle = {};
    _.each(keys, (key) => {
      switch (key) {
        case 'fontSize':
          break;
        case 'letterSpacing':
        case 'color':
        case 'fontFamily':
        case 'fontWeight':
        case 'lineHeight':
          fontStyle[key] = mergedStyle[key];
          break;
        default:
          layoutStyle[key] = mergedStyle[key];
      }
    });
    let maxFontSize = DEFAULT_MAX_FONT_SIZE;
    if (mergedStyle.fontSize) {
      maxFontSize = mergedStyle.fontSize;
    }
    let letterSpacing = 0;
    if (mergedStyle.letterSpacing) {
      letterSpacing = mergedStyle.letterSpacing;
    }
    return {
      fontStyle, layoutStyle, maxFontSize, letterSpacing,
    };
  }

  constructor(props) {
    super(props);
    const {
      fontStyle, layoutStyle, maxFontSize, letterSpacing,
    } = ResponsiveText.calculateStyles(props.style);
    this.state = {
      fontStyle,
      layoutStyle,
      maxFontSize,
      letterSpacing,
      fontSize: 0,
      // If fontSize is adjusted, isAdjusted will be set to true, then layout will not be calculated again.
      isAdjusted: false,
      layoutWidth: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { style, children, suffixElementWidth } = nextProps;
    const {
      fontStyle, layoutStyle, maxFontSize, letterSpacing,
    } = ResponsiveText.calculateStyles(style);

    const { layoutWidth } = this.state;
    // If layout isn't change, but children or style is change, calculate font size again.
    const fontSize = getFontSize(layoutWidth - suffixElementWidth, children.length, maxFontSize, letterSpacing);
    this.setState({
      isAdjusted: false,
      fontStyle,
      layoutStyle,
      maxFontSize,
      fontSize,
    });
  }

  onLayout = (event) => {
    const { children, suffixElementWidth } = this.props;
    const { isAdjusted, maxFontSize, letterSpacing } = this.state;
    if (isAdjusted) {
      return;
    }
    const { width: layoutWidth } = event.nativeEvent.layout;
    // layoutWidth - suffixElementWidth is the width text component can use actually
    const fontSize = getFontSize(layoutWidth - suffixElementWidth, children.length, maxFontSize, letterSpacing);
    this.setState({ fontSize, layoutWidth });
  }

  renderTextElement() {
    const { children } = this.props;
    const {
      fontStyle, maxFontSize, fontSize, layoutStyle,
    } = this.state;
    let textElement = null;
    const isWidthLimited = layoutStyle.position !== 'absolute' || (layoutStyle.left && layoutStyle.right);
    // If width can't be limited by style propertise, render as a normal text.
    if (Platform.OS === 'ios' || !isWidthLimited) {
      textElement = (
        <Text style={[fontStyle, { fontSize: maxFontSize }]} adjustsFontSizeToFit numberOfLines={1}>
          {children}
        </Text>
      );
    } else {
      textElement = (
        <Text style={[styles.text, fontStyle, { fontSize }]}>
          {children}
        </Text>
      );
    }
    return textElement;
  }

  render() {
    const { suffixElement } = this.props;
    const { layoutStyle } = this.state;
    return (
      <View onLayout={this.onLayout} style={[layoutStyle, styles.textView]}>
        {this.renderTextElement()}
        {suffixElement}
      </View>
    );
  }
}

ResponsiveText.propTypes = {
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.string,
  // suffixElement, the element after text component
  suffixElement: PropTypes.element,
  // the width suffixElement occupy
  suffixElementWidth: PropTypes.number,
};

ResponsiveText.defaultProps = {
  style: null,
  children: null,
  suffixElement: null,
  suffixElementWidth: 0,
};
