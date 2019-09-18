import React, { Component } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { reduxForm } from 'redux-form';

import {
  Button,
  Container,
  Content,
  Form,
  Icon,
  Picker,
  Text,
} from 'native-base';

import { PropTypes } from 'prop-types';

import Application from 'mellowallet/lib/Application';

import NavigationService from 'mellowallet/src/services/NavigationService';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import FormPicker from 'mellowallet/src/components/FormInputs/FormPicker';
import FormRow from 'mellowallet/src/components/FormInputs/FormRow';
import Label from 'mellowallet/src/components/Label';
import Loader from 'mellowallet/src/components/Loader';
import RegularFieldTextInput from 'mellowallet/src/components/FormInputs/Fields/RegularFieldTextInput';
import { required } from 'mellowallet/src/utils/validations';
import { t } from 'mellowallet/src/i18n';
import { printError } from 'mellowallet/src/utils';
import {
  walletSaved,
  setWalletToEdit,
  setWalletListDirty,
} from 'mellowallet/src/store/actions/wallet';

import Wallet from 'mellowallet/src/store/models';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
    walletToEdit: rootReducer.walletToEdit,
  };
};

const mapDispatchToProps = dispatch => ({
  walletSaved: wallet => dispatch(walletSaved(wallet)),
  setWalletToEdit: () => dispatch(setWalletToEdit()),
  setWalletListDirty: () => dispatch(setWalletListDirty()),
});

const mode = {
  edit: {
    buttonLabel: 'Edit Wallet',
    headerText: 'Edit Wallet',
    isEditing: true,
    apiCall: (wallet, name) => wallet.originalWallet.set_name(name),

  },
  add: {
    buttonLabel: 'Create Wallet',
    headerText: 'New Wallet',
    isEditing: false,
    apiCall: wallet => Application(app => app.create_wallet(wallet.name, wallet.network)),
  },
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
});

class NewWallet extends Component {
  constructor(props) {
    super(props);
    const { walletToEdit, networks } = this.props;
    this.networks = Object.values(networks);
    const newWallet = {
      name: '',
      network: this.networks[0].name,

    };

    this.state = {
      wallet: walletToEdit || newWallet,
      isLoading: false,
    };

    this.mode = walletToEdit ? mode.edit : mode.add;
    this.initForm();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.cleanWallet);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  initForm = () => {
    const { name } = this.state.wallet;
    const initialValues = {
      walletName: name,
    };

    this.props.initialize(initialValues);
  }

  goBack = () => {
    this.cleanWallet();
    NavigationService.back();
  }

  cleanWallet = () => {
    this.props.setWalletToEdit(null);
  }

  onSavePress = () => {
    const { valid } = this.props;
    if (!valid) {
      return;
    }

    const saveFunc = this.mode === mode.add
      ? this.createWallet
      : this.editWallet;

    saveFunc();
  }

  editWallet = () => {
    const { wallet } = this.state;
    this.setState({ isLoading: true });
    this.mode.apiCall(wallet, wallet.name)
      .then(() => {
        this.props.setWalletListDirty();
        this.goBack();
      }).catch((e) => {
        printError(e, 'danger');
      }).finally(() => this.setState({ isLoading: false }));
  }

  createWallet = () => {
    const wallet = {
      name: this.state.wallet.name,
      network: this.state.wallet.network,
    };

    this.setState({ isLoading: true });

    this.mode.apiCall(wallet)
      .then((savedWallet) => {
        new Wallet(savedWallet)
          .then((localWallet) => {
            this.setState({ isLoading: false });
            this.props.walletSaved(localWallet);
            this.goBack();
          }).catch((e) => {
            this.setState({ isLoading: false });
            printError(e, 'danger');
          });
      }).catch((e) => {
        this.setState({ isLoading: false });
        printError(e, 'danger');
      });
  }

  onNetworkChange = (network) => {
    this.setState(prevState => ({
      wallet: {
        ...prevState.wallet,
        network,
      },
    }));
  }

  onWalletNameChange = (name) => {
    this.setState(prevState => ({
      wallet: {
        ...prevState.wallet,
        name,
      },
    }));
  }

  renderNetworkItem = network => (
    <Picker.Item
      key={network.type}
      label={network.name}
      value={network.type}
    />
  );


  render() {
    const { valid } = this.props;

    const networkItems = this.networks.map(network => this.renderNetworkItem(network));
    const { headerText, buttonLabel } = this.mode;
    return (
      <Container>
        <ActionHeader
          title={t(headerText)}
          backAction={this.goBack}
        >
          <Button
            transparent
            onPress={this.onSavePress}
          >
            <Icon name="check" type="FontAwesome" />
          </Button>
        </ActionHeader>

        <Content
          padder
          contentContainerStyle={styles.container}
        >
          <Loader loading={this.state.isLoading} />
          <Form style={styles.form}>

            <FormRow>
              <FormPicker
                enabled={!this.mode.isEditing}
                placeholder={t('Currency Symbol')}
                selectedValue={this.state.wallet.network}
                onValueChange={this.onNetworkChange}
                headerLabel={t('Select one currency')}
                block
              >
                {networkItems}
              </FormPicker>
            </FormRow>

            <FormRow>
              <RegularFieldTextInput
                name="walletName"
                placeholder={t('Wallet Name')}
                returnKeyType="done"
                onChangeText={this.onWalletNameChange}
                validations={[required]}
                value={this.state.wallet.name}
                onSubmitEditing={this.onSavePress}
              />
              <Label>{t('A descriptive name for your wallet')}</Label>
            </FormRow>

            <FormRow>
              <Button
                disabled={!valid}
                onPress={this.onSavePress}
                style={styles.button}
              >
                <Text>{t(buttonLabel)}</Text>
              </Button>
            </FormRow>

          </Form>
        </Content>

      </Container>
    );
  }
}


NewWallet.propTypes = {
  valid: PropTypes.bool,
  setWalletToEdit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  walletSaved: PropTypes.func.isRequired,
  networks: PropTypes.shape({}).isRequired,
  walletToEdit: PropTypes.shape(Wallet),
  setWalletListDirty: PropTypes.func.isRequired,
};

NewWallet.defaultProps = {
  valid: false,
  walletToEdit: null,
};

const WalletForm = reduxForm({
  form: 'NewWalletForm',
})(NewWallet);

const NewWalletScreen = connect(mapStateToProps, mapDispatchToProps)(WalletForm);

export default NewWalletScreen;
