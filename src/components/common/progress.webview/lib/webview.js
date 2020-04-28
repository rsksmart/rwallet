import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as PropTypes from 'prop-types';
import LoadingBar from './loading-bar';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});


class ProgressBarWebView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0, // range:  0 - 1
      color: props.color,
      visible: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onLoadProgress = (syntheticEvent) => {
    this.setState({ percent: syntheticEvent.nativeEvent.progress });
    const { onLoadProgress } = this.props;
    if (onLoadProgress) {
      onLoadProgress(syntheticEvent);
    }
  };

  onError = (syntheticEvent) => {
    const { errorColor, onError } = this.props;
    this.setState({ color: errorColor, percent: 1 });
    if (onError) {
      onError(syntheticEvent);
    }
  };

  onLoadStart = (syntheticEvent) => {
    const { onLoadStart } = this.props;
    this.setState({ visible: true });
    if (onLoadStart) {
      onLoadStart(syntheticEvent);
    }
  };

  onLoadEnd = (syntheticEvent) => {
    const { onLoadEnd, disappearDuration } = this.props;
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, disappearDuration);
    if (onLoadEnd) {
      onLoadEnd(syntheticEvent);
    }
  };


  render() {
    const { height, forwardedRef } = this.props;
    const { percent, color, visible } = this.state;
    return (
      <View style={styles.container}>
        {visible && <LoadingBar height={height} color={color} percent={percent} />}
        <WebView
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          ref={forwardedRef}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onLoadProgress={this.onLoadProgress}
          onError={this.onError}
        />
      </View>
    );
  }
}

ProgressBarWebView.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  errorColor: PropTypes.string,
  disappearDuration: PropTypes.number,
  onLoadProgress: PropTypes.func,
  onError: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func,
  forwardedRef: PropTypes.element,
};

ProgressBarWebView.defaultProps = {
  height: 3,
  color: '#3B78E7',
  errorColor: '#f30',
  disappearDuration: 300,
  onLoadProgress: undefined,
  onError: undefined,
  onLoadStart: undefined,
  onLoadEnd: undefined,
  forwardedRef: undefined,
};

export default React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ProgressBarWebView {...props} forwardedRef={ref} />
));
