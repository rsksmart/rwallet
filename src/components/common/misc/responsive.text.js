import React, { Component } from 'react';
import {
  Text, View, Platform, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

// https://github.com/facebook/react-native/issues/20906
// magic number, estimated value, fontSize = fontWidth * FONT_SIZE_TIMES;
const FONT_SIZE_TIMES = 1.7;


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
});

// ResponsiveText, fontSize will calculate by text length again
export default class ResponsiveText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adjustsStyle: {
        fontSize: 5,
      },
      // If fontSize is adjusted, isAdjusted will be set to true, then layout will not be calculated again.
      isAdjusted: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({ isAdjusted: false });
  }

  onLayout = (event) => {
    const { children, maxFontSize } = this.props;
    const { isAdjusted } = this.state;
    if (isAdjusted) {
      return;
    }
    const { width } = event.nativeEvent.layout;
    const fontSize = getFontSize(width, children.length, maxFontSize);
    this.setState({
      adjustsStyle: {
        fontSize,
      },
    });
  }

  renderTextElement() {
    const { children, fontStyle, maxFontSize } = this.props;
    const { adjustsStyle } = this.state;
    let textElement = null;
    if (Platform.OS === 'ios') {
      textElement = (
        <Text style={[fontStyle, { fontSize: maxFontSize }]} adjustsFontSizeToFit numberOfLines={1}>
          {children}
        </Text>
      );
    } else {
      textElement = (
        <Text style={[fontStyle, adjustsStyle]}>
          {children}
        </Text>
      );
    }
    return textElement;
  }

  render() {
    const { style, suffixElement } = this.props;
    return (
      <View onLayout={this.onLayout} style={[style, styles.textView]}>
        {this.renderTextElement()}
        {suffixElement}
      </View>
    );
  }
}

ResponsiveText.propTypes = {
  style: PropTypes.arrayOf(PropTypes.object),
  fontStyle: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.string.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  suffixElement: PropTypes.element,
};

ResponsiveText.defaultProps = {
  style: null,
  fontStyle: null,
  suffixElement: null,
};
