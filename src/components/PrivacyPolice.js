import React from 'react';
import {
  Button, H3,
  Text,
  View,
} from 'native-base';
import { t } from 'mellowallet/src/i18n';
import { StyleSheet } from 'react-native';
import LinkText from 'mellowallet/src/components/LinkText';
import { conf } from '../utils/constants';

const styles = StyleSheet.create({
  termsModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  termsTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
});

class PrivacyPolice extends React.PureComponent {
  render() {
    return (
      <View>
        <H3 style={styles.termsTitle}>{t('Accept Terms')}</H3>
        <Text>
          {`${t('By creating an account, you agree to our')} `}
          <LinkText link={conf('termsAndConditionURL')}>
            {`${t('Terms of Service')} `}
          </LinkText>
          {`${t('and')} `}
          <LinkText link={conf('privacityPoliceURL')}>
            {`${t('Privacy Police')} `}
          </LinkText>
        </Text>
      </View>
    );
  }
}

export default PrivacyPolice;
