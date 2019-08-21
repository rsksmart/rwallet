import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Spinner,
  View,
} from 'native-base';

const styles = StyleSheet.create({
  listFooter: {
    flex: 1,
    padding: 10,
  },
});

function listFooter() {
  return (
    <View style={styles.listFooter}>
      <Spinner />
    </View>
  );
}

export default listFooter;
