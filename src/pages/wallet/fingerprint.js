import React, { Component } from 'react';
import {
  Alert, StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';

import TouchID from 'react-native-touch-id';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btn: {
    borderRadius: 3,
    marginTop: 200,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7',
  },
});

function authenticate() {
  // const optionalConfigObject = {
  //   passcodeFallback: true,
  // };

  return TouchID.authenticate(/* null, optionalConfigObject */)
    .then((/* success */) => {
      Alert.alert('Authenticated Successfully');
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(error.message);
    });
}

export default class FingerPrint extends Component {
  static clickHandler() {
    TouchID.isSupported()
      .then(authenticate)
      .catch((/* error */) => {
        Alert.alert('TouchID not supported');
      });
  }

  constructor() {
    super();

    this.state = {
      biometryType: null,
    };
  }

  async componentDidMount() {
    // TouchID.isSupported returns a Promise that rejects if TouchID is not supported.
    // On iOS resolves with a biometryType String of FaceID or TouchID.
    const biometryType = await TouchID.isSupported();
    this.setState({ biometryType });
  }

  render() {
    const { biometryType } = this.state;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.btn}
          onPress={() => FingerPrint.clickHandler()}
          underlayColor="#0380BE"
          activeOpacity={1}
        >
          <Text style={{
            color: '#fff',
            fontWeight: '600',
          }}
          >
            {`Authenticate with ${biometryType}`}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
