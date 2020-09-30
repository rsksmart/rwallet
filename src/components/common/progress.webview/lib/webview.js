import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from './loading-bar';

import presetColor from '../../../../assets/styles/color';
import { createErrorNotification } from '../../../../common/notification.controller';
import appActions from '../../../../redux/app/actions';

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

  onNavigationStateChange = (navState) => {
    const {
      myForwardedRef, onNavigationStateChange, addNotification,
    } = this.props;
    const { url } = navState;
    if (!url.startsWith('https://')) {
      myForwardedRef.current.stopLoading();
      const notification = createErrorNotification(
        'modal.httpIsNotAllowed.title',
        'modal.httpIsNotAllowed.body',
      );
      addNotification(notification);
      return;
    }
    onNavigationStateChange(navState);
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
    const {
      height, myForwardedRef, errorColor, disappearDuration,
      source, javaScriptEnabled, injectedJavaScriptBeforeContentLoaded,
      onMessage, incognito,
    } = this.props;
    const { percent, color, visible } = this.state;
    return (
      <View style={styles.container}>
        {visible && <LoadingBar height={height} color={color} percent={percent} />}
        <WebView
          source={source}
          javaScriptEnabled={javaScriptEnabled}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
          onNavigationStateChange={this.onNavigationStateChange}
          onMessage={onMessage}
          height={height}
          color={color}
          errorColor={errorColor}
          disappearDuration={disappearDuration}
          ref={myForwardedRef}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onLoadProgress={this.onLoadProgress}
          onError={this.onError}
          incognito={incognito}
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
  myForwardedRef: PropTypes.shape({
    current: PropTypes.shape({
      stopLoading: PropTypes.func,
    }),
  }),
  source: PropTypes.shape({}),
  javaScriptEnabled: PropTypes.bool,
  injectedJavaScriptBeforeContentLoaded: PropTypes.string,
  onNavigationStateChange: PropTypes.func,
  onMessage: PropTypes.func,
  incognito: PropTypes.bool,
  addNotification: PropTypes.func.isRequired,
};

ProgressBarWebView.defaultProps = {
  height: 3,
  color: presetColor.brightBlue,
  errorColor: presetColor.scarlet,
  disappearDuration: 300,
  onLoadProgress: undefined,
  onError: undefined,
  onLoadStart: undefined,
  onLoadEnd: undefined,
  myForwardedRef: undefined,
  source: undefined,
  javaScriptEnabled: false,
  injectedJavaScriptBeforeContentLoaded: undefined,
  onNavigationStateChange: undefined,
  onMessage: undefined,
  incognito: false,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

const ProgressBarWebViewWithState = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ProgressBarWebView);

export default React.forwardRef((properties, ref) => {
  const {
    source, javaScriptEnabled, injectedJavaScriptBeforeContentLoaded, onNavigationStateChange, onMessage,
    height, color, errorColor, disappearDuration, incognito,
    onLoadProgress, onError, onLoadStart, onLoadEnd,
  } = properties;
  return (
    <ProgressBarWebViewWithState
      source={source}
      javaScriptEnabled={javaScriptEnabled}
      injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
      onNavigationStateChange={onNavigationStateChange}
      onMessage={onMessage}
      myForwardedRef={ref}
      height={height}
      color={color}
      errorColor={errorColor}
      disappearDuration={disappearDuration}
      onLoadProgress={onLoadProgress}
      onError={onError}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      incognito={incognito}
    />
  );
});
