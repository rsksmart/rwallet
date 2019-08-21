import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  Icon,
  Button,
  Text,
  View,
} from 'native-base';

const styles = StyleSheet.create({
  text: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  image: {
    width: 25,
    height: 11,
  },
  imageContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
});

const imageIcon = require('../../assets/mellow-icon.png');

class BottomTabButton extends React.PureComponent {
  renderIcon() {
    return <Icon name={this.props.icon} />;
  }

  renderImage = () => (
    <View style={styles.imageContainer}>
      <Image source={imageIcon} resizeMode="contain" style={styles.image} />
    </View>
  )

  renderText() {
    const { label } = this.props;
    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.text}
      >
        {label}
      </Text>
    );
  }

  render() {
    const { active, icon } = this.props;
    const iconComponent = icon
      ? this.renderIcon()
      : this.renderImage();

    const textComponent = active ? this.renderText() : <View />;

    return (
      <Button
        vertical
        {...this.props}
      >
        {iconComponent}
        {textComponent}
      </Button>
    );
  }
}

export default BottomTabButton;
