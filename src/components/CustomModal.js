import React from 'react';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types';
import {
  H3,
  View,
  Icon,
  Text,
  Button,
} from 'native-base';
import ActionModal from './ActionModal';

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    textAlign: 'left',
  },
  content: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 100,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  icon: {
    color: '#FFF',
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: '#00AA00',
  },
  description: {
    marginRight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

const CustomModal = (props) => {
  const {
    title,
    description,
    iconName,
    error,
    primaryButtonText,
    onPressPrimaryButton,
    secondaryButtonText,
    onPressSecondaryButton,
    visible,
    onRequestClose,
  } = props;

  const titleView = title && <H3 style={styles.title}>{title}</H3>;

  const icon = (
    <View
      style={[
        styles.iconWrapper,
        ((error && styles.error) || styles.success),
      ]}
    >
      <Icon name={iconName} style={styles.icon} />
    </View>
  );

  const secondaryButton = onPressSecondaryButton && secondaryButtonText && (
    <Button
      onPress={onPressSecondaryButton}
      transparent
    >
      <Text>{secondaryButtonText.toUpperCase()}</Text>
    </Button>
  );

  return (
    <ActionModal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      {titleView}
      <View style={styles.content}>
        {icon}
        <View style={styles.description}>
          <Text>{description}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {secondaryButton}
        <Button
          onPress={onPressPrimaryButton}
          transparent
        >
          <Text>{primaryButtonText.toUpperCase()}</Text>
        </Button>
      </View>
    </ActionModal>
  );
};

CustomModal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  error: PropTypes.bool,
  primaryButtonText: PropTypes.string.isRequired,
  onPressPrimaryButton: PropTypes.func.isRequired,
  secondaryButtonText: PropTypes.string,
  onPressSecondaryButton: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func,
};

CustomModal.defaultProps = {
  title: null,
  error: false,
  secondaryButtonText: null,
  onPressSecondaryButton: null,
  onRequestClose: () => null,
};

export default CustomModal;
