import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, Text, StyleSheet, PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import walletActions from '../../redux/wallet/actions';
import { screen } from '../../common/info';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const PANEL_WIDTH = screen.width - 40;

class WalletList extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  panelDatas = [
    { backgroundColor: 'red', height: '100%', width: PANEL_WIDTH },
    { backgroundColor: 'grey', height: '100%', width: PANEL_WIDTH },
    { backgroundColor: 'yellow', height: '100%', width: PANEL_WIDTH },
    { backgroundColor: 'black', height: '100%', width: PANEL_WIDTH },
    { backgroundColor: 'blue', height: '100%', width: PANEL_WIDTH },
  ]

  constructor(props) {
    super(props);
    this.panelRefs = [];
    this.state = {
      offsetX: 0,
      lastOffsetX: 0,
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder(/* evt, gestureState */) {
        // console.log('onStartShouldSetPanResponder, evt: ', evt);
        // console.log('onStartShouldSetPanResponder, gestureState: ', gestureState);
        return true;
      },
      onMoveShouldSetPanResponder(/* evt, gestureState */) {
        // console.log('onMoveShouldSetPanResponder, evt: ', evt);
        // console.log('onMoveShouldSetPanResponder, gestureState: ', gestureState);
        return true;
      },
      onPanResponderGrant(/* evt, gestureState */) {
        // console.log('onPanResponderGrant, evt: ', evt);
        // console.log('onPanResponderGrant, gestureState: ', gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { lastOffsetX } = this.state;
        // console.log('onPanResponderMove, evt: ', evt);
        // console.log('onPanResponderMove, gestureState: ', gestureState);
        // const {
        //   moveX, moveY, x0, y0, dx, dy, vx, vy,
        // } = gestureState;
        const { dx } = gestureState;
        // console.log(`onPanResponderMove, gestureState, moveX: ${moveX}, moveY: ${moveY}, x0: ${x0}, y0: ${y0}, dx: ${dx}, dy: ${dy}, vx: ${vx}, vy: ${vy}`);
        this.setState({ offsetX: lastOffsetX + dx });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { lastOffsetX } = this.state;
        const { dx, vx } = gestureState;
        // console.log('onPanResponderRelease, evt: ', evt);
        // console.log('onPanResponderRelease, gestureState: ', gestureState);
        // console.log(`onPanResponderMove, gestureState, moveX: ${moveX}, moveY: ${moveY}, x0: ${x0}, y0: ${y0}, dx: ${dx}, dy: ${dy}, vx: ${vx}, vy: ${vy}`);
        const x = lastOffsetX + dx;
        console.log(`onPanResponderRelease, vx: ${vx}`);
        console.log(`lastOffsetX: ${lastOffsetX}, dx: ${dx}`);
        this.setState({ lastOffsetX: x, offsetX: x });
      },
    });
  }

  renderPanels() {
    const { offsetX } = this.state;
    const panels = [];
    this.panelRefs = [];
    _.each(this.panelDatas, (data, index) => {
      const style = {
        backgroundColor: data.backgroundColor,
        width: data.width,
        height: data.height,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: index === 0 ? offsetX : 0,
      };
      panels.push(
        (
          <View
            style={style}
            ref={(ref) => this.panelRefs.push(ref)}
            key={index.toString()}
          >
            <Text>{index}</Text>
          </View>
        ),
      );
    });
    return panels;
  }

  render() {
    // console.log('this.panResponder.panHandlers: ', this.panResponder.panHandlers);
    const {
      onStartShouldSetResponder, onMoveShouldSetResponder, onStartShouldSetResponderCapture, onMoveShouldSetResponderCapture,
      onResponderGrant, onResponderReject, onResponderRelease, onResponderStart, onResponderMove, onResponderEnd, onResponderTerminate, onResponderTerminationRequest,
    } = this.panResponder.panHandlers;
    return (
      <View
        style={styles.page}
        onStartShouldSetResponder={onStartShouldSetResponder}
        onMoveShouldSetResponder={onMoveShouldSetResponder}
        onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        onMoveShouldSetResponderCapture={onMoveShouldSetResponderCapture}
        onResponderGrant={onResponderGrant}
        onResponderReject={onResponderReject}
        onResponderRelease={onResponderRelease}
        onResponderStart={onResponderStart}
        onResponderMove={onResponderMove}
        onResponderEnd={onResponderEnd}
        onResponderTerminate={onResponderTerminate}
        onResponderTerminationRequest={onResponderTerminationRequest}
      >
        {this.renderPanels()}
      </View>
    );
  }
}

WalletList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

const mapDispatchToProps = (dispatch) => ({
  setSwapSource: (walletName, coin) => dispatch(walletActions.setSwapSource(walletName, coin)),
  resetSwap: () => dispatch(walletActions.resetSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);
