import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '25%',
  },
  buttonView: {
    position: 'absolute',
    bottom: '10%',
  },
});

export default class TermRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { opacity, delay } = this.state;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay: delay * 1000,
    }).start();
  }

  render() {
    const { opacity } = this.state;
    const { text } = this.props;
    return (
      <Animated.View style={[styles.termRow, { opacity }]}>
        <View style={styles.termRowLeft}>
          <Feather name="check" size={20} style={styles.check} />
        </View>
        <View style={styles.termRowRight}>
          <Text style={styles.termRowRightText}>{text}</Text>
        </View>
      </Animated.View>
    );
  }
}

TermRow.propTypes = {
  text: PropTypes.string.isRequired,
};
