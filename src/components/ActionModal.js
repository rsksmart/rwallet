import React from 'react';
import {
  Modal,
  StyleSheet,
} from 'react-native';
import { PropTypes } from 'prop-types';
import { View } from 'native-base';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewWrapped: {
    backgroundColor: '#fff',
    marginLeft: 30,
    marginRight: 30,
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
});

const ActionModal = (props) => {
  const {
    children,
    visible,
    onRequestClose,
  } = props;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.viewWrapped}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

ActionModal.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func,
};

ActionModal.defaultProps = {
  onRequestClose: () => null,
};

export default ActionModal;
