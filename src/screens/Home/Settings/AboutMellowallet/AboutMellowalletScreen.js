import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import {
  StyleSheet,
  View,
  BackHandler,
  Image,
} from 'react-native';
import { t } from 'mellowallet/src/i18n';
import Constants from 'expo-constants';
import PrivacyPolice from '../../../../components/PrivacyPolice';

const logo = require('mellowallet/assets/logo.png');

const styles = StyleSheet.create({
  description: {
    padding: 19,
    paddingBottom: 25,
  },
  logo: {
    width: 300,
  },
  viewContainer: {
    paddingTop: 100,
    margin: 20,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class AboutMellowalletScreen extends PureComponent {
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  goBack = () => this.props.navigation.goBack();

  render() {
    const { version } = Constants.manifest;

    return (
      <Container>
        <ActionHeader
          backAction={this.goBack}
          title={t('About Mellowallet')}
        />

        <Content>
          <View style={styles.viewContainer}>
            <Image
              source={logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text>
              Version
              {' '}
              {version}
            </Text>
          </View>
          <View style={styles.viewContainer}>
            <PrivacyPolice/>
          </View>

        </Content>
      </Container>
    );
  }
}
