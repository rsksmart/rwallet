import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Body,
  Card,
  CardItem,
  Icon,
  Left,
  Text,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
  },
  icon: {
    color: 'white',
  },
  message: {
    color: 'white',
  },
});

const warningCard = (props) => {
  const { message, iconName, color } = props;
  return (
    <View style={styles.container}>
      <Card>
        <CardItem style={{ backgroundColor: color }}>
          <Left>
            <Icon name={iconName} style={styles.icon} />
            <Body>
              <Text style={styles.message}>{message}</Text>
            </Body>
          </Left>
        </CardItem>
      </Card>
    </View>
  );
};

warningCard.propTypes = {
  message: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  color: PropTypes.string,
};

warningCard.defaultProps = {
  color: 'white',
};

export default warningCard;
