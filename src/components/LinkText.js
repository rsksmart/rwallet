import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { PropTypes } from 'prop-types';
import { openLink } from 'mellowallet/src/utils';
import { Text } from 'native-base';


const styles = StyleSheet.create({
  link: {
    color: 'grey',
    textDecorationLine: 'underline',
  },
});

class LinkText extends React.PureComponent {
  onLinkPress = () => {
    const { link } = this.props;
    openLink(link);
  }

  render() {
    const { children } = this.props;

    return (
      <Text
        onPress={this.onLinkPress}
        style={styles.link}
      >
        {children}
      </Text>
    );
  }
}

LinkText.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LinkText;
