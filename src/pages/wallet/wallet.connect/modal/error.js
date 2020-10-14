import React from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../../../common/i18n';
import color from '../../../../assets/styles/color';
import fontFamily from '../../../../assets/styles/font.family';

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
    fontFamily: fontFamily.AvenirHeavy,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  description: {
    color: color.black,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
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
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
  },
  tryLaterBtnView: {
    alignSelf: 'center',
    marginTop: 10,
  },
  tryLaterBtnFont: {
    color: color.grayB1,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 16,
  },
});

const ERROR_IMAGE = require('../../../../assets/images/icon/error.png');

export default function ErrorModal({
  description, tryAgain, tryLater,
}) {
  return (
    <View>
      <View style={styles.row}>
        <Image style={styles.image} source={ERROR_IMAGE} />
        <Text style={styles.title}>
          {strings('page.wallet.walletconnect.error')}
          !
        </Text>
      </View>
      <Text style={styles.description}>
        {description}
      </Text>

      <TouchableOpacity
        style={styles.tryAgainBtnView}
        onPress={tryAgain}
      >
        <Text style={[styles.tryAgainBtnFont]}>{strings('page.wallet.walletconnect.tryAgain')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tryLaterBtnView} onPress={tryLater}>
        <Text style={[styles.tryLaterBtnFont]}>{strings('page.wallet.walletconnect.tryLater')}</Text>
      </TouchableOpacity>
    </View>
  );
}

ErrorModal.propTypes = {
  tryAgain: PropTypes.func.isRequired,
  tryLater: PropTypes.func.isRequired,
  description: PropTypes.string,
};

ErrorModal.defaultProps = {
  description: strings('page.wallet.walletconnect.errorDesc'),
};
