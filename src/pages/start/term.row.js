import React, { Component } from 'react';
import {
  View, StyleSheet, Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import Loc from '../../components/common/misc/loc';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  termRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  termRowLeft: {
    marginRight: 15,
    paddingTop: 3,
  },
  check: {
    color: color.app.theme,
  },
  termRowRight: {
    width: 0,
    flexGrow: 1,
    flex: 1,
  },
  termRowRightText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '300',
    letterSpacing: 0.32,
    color: '#000000',
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
          <Loc style={[styles.termRowRightText]} text={text} />
        </View>
      </Animated.View>
    );
  }
}

TermRow.propTypes = {
  text: PropTypes.string.isRequired,
};
