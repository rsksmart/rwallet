import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Container } from 'native-base';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import onBoardingStepEnum from 'mellowallet/src/utils/onBoardingStepEnum';
import { conf } from '../../utils/constants';

const logo = require('mellowallet/assets/logo.png');

const styles = StyleSheet.create({
  logo: {
    width: 300,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    let onBoardingCompleted = true;

    if (conf('ASK_FOR_COMPLETED_ON_BOARDING')) {
      const onBoardingStep = await AsyncStorage.getItem(AsyncStorageEnum.ON_BOARDING_STEP);
      onBoardingCompleted = onBoardingStepEnum.ON_COMPLETED === onBoardingStep;
    }

    // This will switch to the App screen or onBoarding screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(onBoardingCompleted ? 'App' : 'onBoarding'); // TODO: Change the second 'App' to 'OnBoardin'
  };

  // Render any loading content that you like here
  render() {
    return (
      <Container>
        <View style={styles.viewContainer}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Container>
    );
  }
}
