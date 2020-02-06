import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.component.touchSensorModal.backgroundColor,
  },
  panel: {
    marginHorizontal: 25,
    alignItems: 'center',
    backgroundColor: color.component.touchSensorModal.panel.backgroundColor,
    borderRadius: 5,
    paddingBottom: 60,
  },
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: color.component.touchSensorModal.color,
    marginTop: 30,
  },
  finger: {
    marginTop: 45,
    marginBottom: 30,
  },
  passcode: {},
  passcodeText: {
    color: '#000000',
  },
  errView: {
    marginTop: 5,
    color: 'red',
  },
});

const finger = require('../../../assets/images/misc/finger.png');

export default class TouchSensorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      modalVisible: false,
      transparent: true,
      errorMessage: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      errorMessage: nextProps.errorMessage,
    });
  }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }

    startShow = () => {}

    render() {
      const {
        onUsePasscodePress, onUserCancel,
      } = this.props;
      const { animationType, transparent, modalVisible } = this.state;
      let errView = null;
      const { errorMessage } = this.state;
      if (errorMessage && errorMessage !== '') {
        errView = (
          <Loc style={[styles.errView]} text={errorMessage} />
        );
      }
      return (
        <Modal
          animationType={animationType}
          transparent={transparent}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
            onUserCancel();
          }}
          onShow={this.startShow}
        >
          <View
            style={styles.container}
          >
            <View style={styles.panel}>
              <Loc style={[styles.title]} text="modal.touchSensor.title" />
              <Image style={styles.finger} source={finger} />
              <TouchableOpacity
                style={styles.passcode}
                onPress={() => {
                  if (onUsePasscodePress) {
                    this.setModalVisible(false);
                    onUsePasscodePress();
                  }
                }}
              >
                <Loc style={[styles.passcodeText]} text="modal.touchSensor.usePasscode" />
              </TouchableOpacity>
              {errView}
            </View>
          </View>
        </Modal>
      );
    }
}

TouchSensorModal.propTypes = {
  onUsePasscodePress: PropTypes.func,
  onUserCancel: PropTypes.func,
  errorMessage: PropTypes.string,
};

TouchSensorModal.defaultProps = {
  onUsePasscodePress: null,
  onUserCancel: null,
  errorMessage: null,
};
