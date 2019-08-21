import React from 'react';
import {
  Card,
  Spinner,
  View,
} from 'native-base';

const LoadingCard = () => (
  <View>
    <Card>
      <Spinner />
    </Card>
  </View>
);

export default LoadingCard;
