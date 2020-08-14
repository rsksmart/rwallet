import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: color.blackA64,
  },
  activityIndicatorWrapper: {
    backgroundColor: color.white,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const Loader = (props) => {
  const {
    loading,
  } = props;

  return (
    <Modal
      transparent
      animationType="none"
      visible={loading}
      onRequestClose={() => { console.log('close modal'); }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
          />
        </View>
      </View>
    </Modal>
  );
};


Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loader;
