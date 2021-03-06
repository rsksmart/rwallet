import React from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BaseModal from './base';
import { WALLET_CONNECT } from '../../../../common/constants';

const { MODAL_TYPE } = WALLET_CONNECT;

const styles = StyleSheet.create({
  image: {
    marginTop: 25,
    alignSelf: 'center',
  },
});

const COMPLETED_IMAGE = require('../../../../assets/images/icon/completed.png');

export default function SuccessModal({
  title, cancelPress, description,
}) {
  return (
    <BaseModal
      title={title}
      description={description}
      content={(
        <>
          <Image style={styles.image} source={COMPLETED_IMAGE} />
        </>
        )}
      cancelPress={cancelPress}
      modalType={MODAL_TYPE.NOTIFICATION}
    />
  );
}

SuccessModal.propTypes = {
  title: PropTypes.string.isRequired,
  cancelPress: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
};
