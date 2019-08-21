import React from 'react';
import {
  Button,
  Container,
  Text,
  View,
} from 'native-base';
import { Image, StyleSheet } from 'react-native';
import NavigationService from 'mellowallet/src/services/NavigationService';
import { t } from 'mellowallet/src/i18n';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { setWalletListDirty } from 'mellowallet/src/store/actions/wallet';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import CustomModal from 'mellowallet/src/components/CustomModal';
import ConfirmationDetails from './ConfirmationDetails';

const shapeShiftLogo = require('mellowallet/assets/shapeshift_logo.png');

const styles = StyleSheet.create({
  shapeShiftLogo: {
    width: 200,
    height: 73,
  },
  shapeShiftLogoContainer: {
    padding: 15,
    alignItems: 'center',
  },
  buttonSection: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});

const mapDispatchToProps = dispatch => ({
  setWalletListDirty: () => dispatch(setWalletListDirty()),
});

class ConfirmationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.changelly = props.navigation.getParam('changelly');
    this.networkFrom = props.navigation.getParam('networkFrom');
    this.networkTo = props.navigation.getParam('networkTo');
    this.state = {
      error: false,
      showResultModal: false,
      errorMessage: '',
    };
  }

  backAction = () => {
    NavigationService.back();
  }

  confirmExchange = async () => {
    try {
      const result = await this.changelly.confirm();
      if (result.success) {
        this.props.setWalletListDirty();
        this.setState({ showResultModal: true });
      }
    } catch (e) {
      this.setState({
        showResultModal: true,
        error: true,
        errorMessage: e.error_message,
      });
    }
  }

  onFinishTransfer = () => {
    const { error } = this.state;
    if (!error) {
      NavigationService.navigate('Home');
      return;
    }
    this.setState({
      showResultModal: false,
      error: false,
      errorMessage: '',
    });
  }

  render() {
    const { error, errorMessage, showResultModal } = this.state;
    return (
      <Container>
        <ActionHeader
          title={t('Shapeshift')}
          backAction={this.backAction}
        />

        <CustomModal
          title={error ? t('Transaction Error') : t('Transaction Succesful')}
          description={error ? errorMessage : t('The funds have been exchanged in your wallet.')}
          visible={showResultModal}
          iconName={error ? 'priority-high' : 'check'}
          error={error}
          primaryButtonText={t('Ok')}
          onPressPrimaryButton={this.onFinishTransfer}
          secondaryButtonText={t('View TX hash')}
          onPressSecondaryButton={this.openHashOnBrowser}
        />

        <View style={styles.shapeShiftLogoContainer}>
          <Image source={shapeShiftLogo} style={styles.shapeShiftLogo} resizeMode="contain" />
        </View>

        <ConfirmationDetails details={{
          ...this.changelly.src_amount,
          sectionName: t('To exchange'),
          decimalPlaces: this.networkFrom.decimal_places,
        }}
        />

        <ConfirmationDetails details={{
          ...this.changelly.fees,
          sectionName: t('Transaction fee'),
          decimalPlaces: this.networkFrom.decimal_places,
        }}
        />

        <ConfirmationDetails details={{
          ...this.changelly.dst_amount,
          sectionName: t('To receive'),
          decimalPlaces: this.networkTo.decimal_places,
        }}
        />

        <View style={styles.buttonSection}>
          <Button block onPress={() => this.confirmExchange()}><Text>{t('Confirm Exchange')}</Text></Button>
        </View>

      </Container>
    );
  }
}

ConfirmationScreen.propTypes = {
  setWalletListDirty: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ConfirmationScreen);
