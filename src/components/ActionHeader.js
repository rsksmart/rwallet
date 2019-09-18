import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  Right,
  Text,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '500',
    color: '#FFF',
    fontSize: 20,
  },
  left: {
    maxWidth: 50,
  },
});

class ActionHeader extends React.PureComponent {
  render() {
    const {
      backAction,
      children,
      title,
    } = this.props;

    const left = backAction
      ? (
        <Left style={styles.left}>
          <Button
            transparent
            onPress={backAction}
          >
            <Icon name="ios-arrow-back" />
          </Button>
        </Left>
      )
      : <View />;

    const right = (React.Children.count(children) > 0)
      ? (
        <Right>
          {children}
        </Right>
      ) : <View />;

    return (
      <Header style={styles.header}>
        {left}
        <Body>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </Body>
        {right}
      </Header>
    );
  }
}

ActionHeader.propTypes = {
  children: PropTypes.node,
  backAction: PropTypes.func,
  title: PropTypes.string,
};

ActionHeader.defaultProps = {
  children: null,
  backAction: undefined,
  title: '',
};

export default ActionHeader;
