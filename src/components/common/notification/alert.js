import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#9B9B9B',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginTop: 22,
  },
  text: {
    color: '#0B0B0B',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 30,
  },
  line: {
    borderBottomColor: '#DCDCDC',
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  button: {
    color: '#00B520',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
    };
  }

  startShow = () => {
  };

  render() {
    const { animationType, transparent } = this.state;
    const { title, message, onClosePress } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible
        onShow={this.startShow}
      >
        <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ marginHorizontal: 25, backgroundColor: 'white', borderRadius: 5 }}>
            <View style={{ paddingHorizontal: 20 }}>
              <Loc style={[styles.title]} text={title} />
              <Loc style={[styles.text]} text={message} />
            </View>
            <View style={styles.line} />
            <TouchableOpacity onPress={onClosePress}>
              <Loc style={[styles.button]} text="GOT IT" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  onClosePress: PropTypes.func,
  message: PropTypes.string.isRequired,
};

Alert.defaultProps = {
  onClosePress: null,
};
