import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../../../components/headers/header';
import BasePageGereral from '../../base/base.page.general';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import color from '../../../assets/styles/color.ts';
import space from '../../../assets/styles/space';
import Button from '../../../components/common/button/button';
import AddressSelectionModal from '../../../components/common/modal/address.selection.modal';
import { strings } from '../../../common/i18n';
import parse from '../../../common/parse';
import config from '../../../../config';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../../common/notification.controller';
import appActions from '../../../redux/app/actions';
import storage from '../../../common/storage';
import CreateRnsConfirmation from '../../../components/rns/create.rns.confirmation';
import common from '../../../common/common';
import TypeTag from '../../../components/common/misc/type.tag';

const SUBDOMAIN_LENGTH_MIN = 3;
const SUBDOMAIN_LENGTH_MAX = 12;

const RnsNameState = {
  UNCHECKED: 0,
  AVAILABLE: 1,
  UNAVAILABLE: 2,
};

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  title: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontSize: 16,
    color: color.black,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#F2F2F2',
    height: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#919191',
  },
  addButtonPlus: {
    fontSize: 17,
    color: color.app.theme,
    marginRight: 4,
  },
  subdomainInput: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    flex: 1,
    marginRight: 10,
  },
  rnsRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    marginBottom: 20,
  },
  rnsTokenInput: {
    width: '100%',
    flex: 1,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  rnsTokenButton: {
    height: 40,
    backgroundColor: color.component.input.backgroundColor,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trash: {
    fontSize: 20,
    color: color.app.theme,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 10,
  },
  rnsRowBalance: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginRight: 7,
  },
  rnsRowAddress: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginRight: 7,
    color: '#979797',
    flex: 1,
  },
  rnsRowChevron: {
    fontSize: 30,
    color: '#CBC6C6',
    right: 5,
  },
  notice: {
    color: color.warningText,
    marginTop: 10,
  },
  successNotice: {
    color: '#00B520',
    marginTop: 10,
  },
});

const getTokens = (wallets) => {
  let tokens = [];
  _.each(wallets, (wallet) => {
    let isTestnetFound = false;
    let isMainnetFound = false;
    for (let i = 0; i < wallet.coins.length; i += 1) {
      const coin = wallet.coins[i];
      if (coin.chain === 'Rootstock') {
        if (coin.type === 'Mainnet' && !isMainnetFound) {
          isMainnetFound = true;
          tokens.push(coin);
        }
        if (coin.type === 'Testnet' && !isTestnetFound) {
          isTestnetFound = true;
          tokens.push(coin);
        }
        if (isMainnetFound && isTestnetFound) {
          return;
        }
      }
    }
  });
  tokens = tokens.sort((a, b) => {
    if (a.type === 'Mainnet') {
      return -1;
    }
    return b.type === 'Mainnet' ? 1 : -1;
  });
  return tokens;
};

class RnsAddress extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { walletManager, navigation } = props;
    const { coin } = navigation.state.params;
    const { wallets } = walletManager;

    this.tokens = getTokens(wallets);

    this.coin = coin;
    const {
      address, symbol, balance, type,
    } = this.coin;

    this.state = {
      rnsRows: [{
        address, symbol, balance, type, rnsNameState: RnsNameState.UNCHECKED,
      }],
      selectItems: [],
      isLoading: false,
    };
  }

  onRnsNameTextChange = (text, index) => {
    const { rnsRows } = this.state;
    const newRnsRows = [...rnsRows];
    const regex = /^[a-z0-9]*$/g;
    const match = regex.exec(text);
    if (!match) {
      return;
    }
    newRnsRows[index].subdomain = text;
    this.setState({ rnsRows: newRnsRows });
  }

  onCreatePressed = async () => {
    const { addNotification } = this.props;
    const { rnsRows } = this.state;
    const newRnsRows = [...rnsRows];

    // Check with the server if the domain names are available
    // Show loading UI during the progress
    // If it's error during the progress, show error notification.
    this.setState({ isLoading: true });
    const queryParams = {};
    queryParams.subdomainList = _.map(newRnsRows, (row) => {
      const { subdomain, type } = row;
      return { subdomain, type };
    });
    let result = null;
    try {
      result = await parse.isSubdomainAvailable(queryParams);
    } catch (error) {
      console.log(error);
      const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification('button.retry');
      addNotification(notification);
      return;
    } finally {
      this.setState({ isLoading: false });
    }

    // If all the domain names are available, ask user to create domains.
    // Else, notify user to check names.
    console.log('parse.isSubdomainAvailable, result: ', result);
    let isAllDomainValid = true;
    _.each(result, (item, index) => {
      if (!item) {
        newRnsRows[index].rnsNameState = RnsNameState.UNAVAILABLE;
        isAllDomainValid = false;
      } else {
        newRnsRows[index].rnsNameState = RnsNameState.AVAILABLE;
      }
    });
    if (isAllDomainValid) {
      this.rnsConfirmation.show();
    } else {
      const notification = createErrorNotification(
        'modal.rnsNameUnavailable.title',
        'modal.rnsNameUnavailable.body',
        'button.gotIt',
      );
      addNotification(notification);
      this.setState({ rnsRows: newRnsRows });
    }
  }

  createSubdomain = async () => {
    const { rnsRows } = this.state;
    const { navigation, addNotification } = this.props;

    // Save registering subdomains to native storage
    const subdomains = _.map(rnsRows, (row) => {
      const { subdomain, address, type } = row;
      return { subdomain, address, type };
    });
    storage.setRnsRegisteringSubdomains(subdomains);

    // Send subdomains to server
    const user = await parse.getUser();
    const fcmToken = user ? user.get('fcmToken') : null;
    const params = { fcmToken };
    params.subdomainList = _.map(rnsRows, (row) => {
      const { subdomain, type, address } = row;
      return { subdomain, type, address };
    });
    this.setState({ isLoading: true });
    let result = null;
    try {
      result = await parse.createSubdomain(params);
    } catch (error) {
      console.log(error);
      const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification('button.retry');
      addNotification(notification);
      storage.clearRnsRegisteringSubdomains();
      return;
    } finally {
      this.setState({ isLoading: false });
    }
    console.log('parse.createSubdomain, result: ', result);
    navigation.navigate('RnsStatus', { isSkipCreatePage: true });
  }

  onAddButtonPressed = () => {
    const { rnsRows } = this.state;
    const { tokens } = this;
    let foundToken = null;
    for (let i = 0; i < tokens.length; i += 1) {
      const { address } = tokens[i];
      const rnsRow = _.find(rnsRows, { address });
      if (!rnsRow) {
        foundToken = tokens[i];
        break;
      }
    }
    const {
      address, balance, symbol, type,
    } = foundToken;
    const newRnsRows = [...rnsRows, {
      address, balance, symbol, type, rnsNameState: RnsNameState.UNCHECKED,
    }];
    this.setState({ rnsRows: newRnsRows });
  }

  onTokenButtonPressed = (rnsRowIndex, address) => {
    const { rnsRows } = this.state;
    const selectItems = [];
    let selectedIndex = 0;
    _.each(this.tokens, (token) => {
      if (token.address === address) {
        selectItems.push(token);
        selectedIndex = selectItems.length - 1;
        return;
      }
      const rnsRow = _.find(rnsRows, { address: token.address });
      if (!rnsRow) {
        selectItems.push(token);
      }
    });
    this.rnsRowIndex = rnsRowIndex;
    this.showSelectionModal(selectItems, selectedIndex);
  }

  showSelectionModal = (selectItems, selectedIndex) => {
    this.setState({ selectItems });
    this.selectionModal.show(selectedIndex);
  }

  onSelectionModalConfirmed = (selectedIndex) => {
    const { rnsRows } = this.state;
    const newRnsRows = [...rnsRows];
    const { selectItems } = this.state;
    const { address, type } = selectItems[selectedIndex];
    newRnsRows[this.rnsRowIndex].address = address;
    newRnsRows[this.rnsRowIndex].type = type;
    this.setState({ rnsRows: newRnsRows });
  }

  onDeleteButtonPressed = (index) => {
    const { rnsRows } = this.state;
    rnsRows.splice(index, 1);
    this.setState({ rnsRows });
  }

  onRnsNameBlur = (index) => {
    const { rnsRows } = this.state;
    const newRnsRows = [...rnsRows];
    const rnsRow = newRnsRows[index];
    rnsRow.errorMessage = null;
    // If subdomain entered is not empty, and its length is less than SUBDOMAIN_LENGTH_MIN, show error message.
    if (!_.isEmpty(rnsRow.subdomain) && rnsRow.subdomain.length < SUBDOMAIN_LENGTH_MIN) {
      rnsRow.errorMessage = strings('page.wallet.rnsCreateName.nameTooShort', { count: SUBDOMAIN_LENGTH_MIN });
    }
    this.setState({ rnsRows: newRnsRows });
  }

  renderRnsRow = (item, index) => {
    const { address, subdomain } = item;
    const { rnsRows } = this.state;
    const addressText = common.getShortAddress(address);
    const isTouchDisabled = !(index === 0 || rnsRows.length === this.tokens.length);
    const { errorMessage, rnsNameState, type } = rnsRows[index];
    let message = null;
    if (rnsNameState !== RnsNameState.UNCHECKED) {
      message = rnsNameState === RnsNameState.UNAVAILABLE
        ? <Text style={styles.notice}>{strings('page.wallet.rnsCreateName.nameUnavailable')}</Text>
        : <Text style={styles.successNotice}>{strings('page.wallet.rnsCreateName.nameAvailable')}</Text>;
    } else {
      message = errorMessage ? <Text style={styles.notice}>{errorMessage}</Text> : null;
    }
    return (
      <View style={styles.rnsRow}>
        <View style={styles.sectionContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{strings('page.wallet.rnsCreateName.address')}</Text>
            <TouchableOpacity onPress={() => { this.onDeleteButtonPressed(index); }}>
              { index !== 0 && <FontAwesome style={styles.trash} name="trash-o" /> }
            </TouchableOpacity>
          </View>
          <View style={styles.rnsTokenInput}>
            <TouchableOpacity
              style={styles.rnsTokenButton}
              onPress={() => { this.onTokenButtonPressed(index, address); }}
              disabled={!isTouchDisabled}
            >
              <TypeTag type={type} />
              <Text style={[styles.rnsRowAddress, space.marginLeft_8]}>{addressText}</Text>
              { isTouchDisabled && <EvilIcons style={styles.rnsRowChevron} name="chevron-down" /> }
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.sectionContainer, space.marginBottom_15]}>
          <Loc style={[styles.title, space.marginBottom_10]} text="page.wallet.rnsCreateName.rnsName" />
          <View style={styles.row}>
            <TextInput
              style={[presetStyle.textInput, styles.subdomainInput]}
              value={subdomain}
              onChangeText={(text) => { this.onRnsNameTextChange(text, index); }}
              onBlur={() => { this.onRnsNameBlur(index); }}
              autoCapitalize="none"
              maxLength={SUBDOMAIN_LENGTH_MAX}
            />
            <Text style={styles.domainText}>{`.${config.rnsDomain}`}</Text>
          </View>
          {message}
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { rnsRows, selectItems, isLoading } = this.state;

    const rnsRow = _.find(rnsRows, (row) => !row.subdomain && row.errorMessage);
    const bottomButton = (<Button text="button.create" onPress={this.onCreatePressed} disabled={!!rnsRow} />);

    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader
        isLoading={isLoading}
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.rnsCreateName.title" />}
        customBottomButton={bottomButton}
      >
        <View style={styles.body}>
          <FlatList
            extraData={rnsRows}
            data={rnsRows}
            renderItem={({ item, index }) => (this.renderRnsRow(item, index))}
            keyExtractor={(item, index) => index.toString()}
          />
          { rnsRows.length < this.tokens.length && (
          <TouchableOpacity style={styles.addButton} onPress={this.onAddButtonPressed}>
            <Feather style={styles.addButtonPlus} name="plus" />
            <Text style={styles.addButtonText}>{strings('page.wallet.rnsCreateName.anotherAddress')}</Text>
          </TouchableOpacity>
          )}
        </View>
        <AddressSelectionModal
          items={selectItems}
          ref={(ref) => { this.selectionModal = ref; }}
          onConfirm={this.onSelectionModalConfirmed}
          title={strings('page.wallet.rnsCreateName.selectAddress')}
        />
        <CreateRnsConfirmation
          ref={(ref) => { this.rnsConfirmation = ref; }}
          data={rnsRows}
          onConfirm={this.createSubdomain}
        />
      </BasePageGereral>
    );
  }
}

RnsAddress.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RnsAddress);
