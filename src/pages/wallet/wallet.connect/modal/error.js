import React, { PureComponent } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../../../assets/styles/color';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  image: {
    alignSelf: 'center',
    marginRight: 10,
  },
  title: {
    color: color.black,
    fontSize: 17,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  description: {
    color: color.black,
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: 28,
  },
  tryAgainBtnView: {
    width: '80%',
    height: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.app.theme,
    borderRadius: 27,
    marginTop: 30,
  },
  tryAgainBtnFont: {
    color: color.concrete,
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  tryLaterBtnView: {
    alignSelf: 'center',
    marginTop: 10,
  },
  tryLaterBtnFont: {
    color: color.grayB1,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
});

const ERROR_IMAGE = require('../../../../assets/images/icon/error.png');

export default class ErrorModal extends PureComponent {
  render() {
    const {
      description, tryAgain, tryLater,
    } = this.props;

    return (
      <View>
        <View style={styles.row}>
          <Image style={styles.image} source={ERROR_IMAGE} />
          <Text style={styles.title}>Error!</Text>
        </View>
        <Text style={styles.description}>
          {description}
        </Text>

        <TouchableOpacity
          style={styles.tryAgainBtnView}
          onPress={tryAgain}
        >
          <Text style={[styles.tryAgainBtnFont]}>Try again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tryLaterBtnView} onPress={tryLater}>
          <Text style={[styles.tryLaterBtnFont]}>Try it later</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

ErrorModal.propTypes = {
  tryAgain: PropTypes.func.isRequired,
  tryLater: PropTypes.func.isRequired,
  description: PropTypes.string,
};

ErrorModal.defaultProps = {
  description: 'Error! An error occurred, please try again later (there may be many reasons, such as network problems, user rejection, incorrect passcode, insufficient handling fee, etc.)',
};
