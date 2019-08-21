import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  Container,
  Text,
  ListItem,
  Button,
} from 'native-base';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Application from 'mellowallet/lib/Application';

import Wallet from 'mellowallet/src/store/models';
import { t } from 'mellowallet/src/i18n';
import { printError } from 'mellowallet/src/utils';
import ListFooter from 'mellowallet/src/components/ListFooter';
import { setWalletListDirty } from 'mellowallet/src/store/actions/wallet';
import { copy } from 'mellowallet/src/utils';

const mapDispatchToProps = dispatch => ({
  setWalletListDirty: () => dispatch(setWalletListDirty()),
});


const styles = StyleSheet.create({
  createAddressButton: {
    alignSelf: 'center',
    borderRadius: 5,
  },
});

class AddressesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      addresses: [...this.props.wallet.addresses],
    };
  }

  onCreateAddressPress = async () => {
    const { wallet } = this.props;
    this.setState({ isLoading: true });
    const remoteWallet = await Application(app => app.get_wallet_by_id(wallet.id));
    remoteWallet.generate_address()
      .then((address) => {
        this.setState(prevState => ({
          addresses: [...prevState.addresses, address],
          isLoading: false,
        }));
        this.props.setWalletListDirty();
      })
      .catch(e => printError(e));
  }

  renderCreateAddressButton = () => (
    <Button
      style={styles.createAddressButton}
      onPress={this.onCreateAddressPress}
    >
      <Text>{t('Create new address')}</Text>
    </Button>
  )

  /**
  * Returns list's loading footers
  */
  renderListFooterComponent = () => {
    const { isLoading } = this.state;
    return isLoading ? <ListFooter /> : this.renderCreateAddressButton();
  }

  /**
  * Returns the Address item view
  * @param {*} item
  */
  renderAddressItem = ({ item }) => (
    <ListItem
      button
      noBorder
      onLongPress={() => copy(item, t('Wallet address copied'))}
    >
      <Text>
        {item}
      </Text>
    </ListItem>
  )

  render() {
    return (
      <Container>
        <FlatList
          ref={(c) => { this.flatList = c; }}
          data={this.state.addresses}
          renderItem={this.renderAddressItem}
          keyExtractor={address => address}
          ListFooterComponent={this.renderListFooterComponent}
        />
      </Container>
    );
  }
}

AddressesScreen.propTypes = {
  wallet: PropTypes.shape(Wallet).isRequired,
  setWalletListDirty: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(AddressesScreen);
