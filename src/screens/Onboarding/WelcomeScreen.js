import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Text,
  H1,
  Button,
  H3,
} from 'native-base';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import material from 'mellowallet/native-base-theme/variables/material';
import { t } from 'mellowallet/src/i18n';
import ActionModal from 'mellowallet/src/components/ActionModal';
import LinkText from 'mellowallet/src/components/LinkText';
import Loader from 'mellowallet/src/components/Loader';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import onBoardingStepEnum from 'mellowallet/src/utils/onBoardingStepEnum';
import { conf } from '../../utils/constants';

const logo = require('mellowallet/assets/logo.png');

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: 200,
  },
  importWalletButton: {
    backgroundColor: '#17EAD9',
  },
  importWalletText: {
    color: 'black',
  },
  logo: {
    width: 300,
  },
  termsModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  termsTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 0.5,
  },
  welcomeText: {
    color: material.brandPrimary,
  },
});

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    updateStep: rootReducer.updateStep,
    importedWallet: rootReducer.importedWallet,
    step: rootReducer.step,
  };
};

const onBoardingFlow = {
  createWallet: 'createWallet',
  importWallet: 'importWallet',
};

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isLoading: false,
      selectedFlow: undefined,
    };
  }

  componentDidMount() {
    this.manageStep();
  }

  async componentWillReceiveProps(props) {
    const { importedWallet, updateStep, step } = props;
    if (updateStep) {
      await this.updateStep(step);
      this.manageStep();
    }

    if (importedWallet) {
      this.onWalletImported(importedWallet);
    }
  }

  updateStep = (step) => {
    if (!step) {
      return;
    }
    AsyncStorage.setItem(
      AsyncStorageEnum.ON_BOARDING_STEP,
      step,
    );
  };

  onWalletImported = () => {
    AsyncStorage.multiSet(
      [
        [
          AsyncStorageEnum.ON_BOARDING_STEP,
          onBoardingStepEnum.IMPORTED_WALLET,
        ],
      ],
    )
      .then(() => this.manageStep());
  };

  getStep = () => AsyncStorage.getItem(AsyncStorageEnum.ON_BOARDING_STEP);

  manageStep = () => {
    this.getStep()
      .then(step => this.navigateToStep(step));
  };

  navigateToStep = (step) => {
    const { selectedFlow } = this.state;
    if (!step && selectedFlow) {
      this.navigate('CreatePinScreen');
    }

    if (onBoardingStepEnum.PIN_CREATED === step && selectedFlow === onBoardingFlow.createWallet) {
      this.navigate('CreateWalletScreen');
    }

    if (onBoardingStepEnum.PIN_CREATED === step && selectedFlow === onBoardingFlow.importWallet) {
      this.navigate('ImportWalletScreen');
    }

    if (onBoardingStepEnum.CREATED_WALLET === step) {
      this.navigate('RecoveryPhraseScreen');
    }

    if (onBoardingStepEnum.IMPORTED_WALLET === step
      || onBoardingStepEnum.PHRASE_VERIFIED === step) {
      this.onBoardinCompleted();
    }
  };


  onBoardinCompleted = async () => {
    await AsyncStorage.setItem(AsyncStorageEnum.ON_BOARDING_STEP, onBoardingStepEnum.ON_COMPLETED);
    this.navigate('App', { showPinModal: false });
  };

  onCreateWalletPress = () => {
    this.setState({
      selectedFlow: onBoardingFlow.createWallet,
      showModal: true,
    });
  };

  onImportWalletPress = () => {
    this.setState({
      selectedFlow: onBoardingFlow.importWallet,
      showModal: true,
    });
  };

  onCancelModalPress = () => this.setState({ showModal: false });

  onAcceptModalPress = () => {
    this.setState({ showModal: false });
    this.manageStep();
  };

  navigate = (screen) => {
    const { navigation } = this.props;
    navigation.navigate(screen, { fromWelcomeScreen: true });
  };

  render() {
    const { showModal } = this.state;
    return (
      <Container>
        <Loader loading={this.state.isLoading}/>
        <ActionModal visible={showModal}>
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
          <View style={styles.termsModalActions}>
            <Button
              onPress={this.onCancelModalPress}
              transparent
            >
              <Text>{t('Cancel')}</Text>
            </Button>
            <Button
              onPress={this.onAcceptModalPress}
              transparent
            >
              <Text>{t('Ok')}</Text>
            </Button>
          </View>
        </ActionModal>

        <View style={[styles.viewContainer, styles.welcomeContainer]}>
          <H1 style={styles.welcomeText}>
            {t('Welcome to')}
          </H1>
        </View>

        <View style={styles.viewContainer}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.viewContainer}>
          <Button
            onPress={this.onCreateWalletPress}
            style={styles.button}
          >
            <Text>{t('Create Wallet')}</Text>
          </Button>
          <Button
            onPress={this.onImportWalletPress}
            style={[styles.button, styles.importWalletButton]}
          >
            <Text style={styles.importWalletText}>{t('Import Wallet')}</Text>
          </Button>
        </View>

      </Container>
    );
  }
}

Welcome.propTypes = {
  updateStep: PropTypes.bool,
  importedWallet: PropTypes.bool,
};

Welcome.defaultProps = {
  updateStep: true,
  importedWallet: false,
};

const WelcomeScreen = connect(mapStateToProps, null)(Welcome);

export default WelcomeScreen;
