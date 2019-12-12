import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

// https://github.com/facebook/react-native/issues/20906
const FONT_SIZE_TIMES = 1.7; // magic number


const getFontSize = (width, length, maxFontSize) => {
  let fontSize = width / length;
  fontSize = Math.min(FONT_SIZE_TIMES * fontSize, maxFontSize);
  return fontSize;
};

export default class ResponsiveText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adjustsStyle: {
        fontSize: 5,
      },
      isAdjusted: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({ isAdjusted: true });
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
      isAdjusted: true,
    });
  }

  render() {
    const { style, children, fontStyle } = this.props;
    const { adjustsStyle } = this.state;
    const textElement = (
      <Text
        style={[adjustsStyle, fontStyle]}
      >
        {children}
      </Text>
    );
    return (
      <View onLayout={this.onLayout} style={[style]}>
        {textElement}
      </View>
    );
  }
}

ResponsiveText.propTypes = {
  style: PropTypes.arrayOf(PropTypes.object),
  fontStyle: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.string,
  maxFontSize: PropTypes.number,
};

ResponsiveText.defaultProps = {
  style: null,
  fontStyle: null,
  children: null,
  maxFontSize: 35,
};
