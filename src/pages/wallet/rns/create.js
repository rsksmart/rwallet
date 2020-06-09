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
import SelectionModal from '../../../components/common/modal/selection.modal';
import { strings } from '../../../common/i18n';
import parse from '../../../common/parse';
import config from '../../../../config';
import { createErrorNotification } from '../../../common/notification.controller';
import appActions from '../../../redux/app/actions';
import { createInfoConfirmation } from '../../../common/confirmation.controller';

const SUBDOMAIN_LENGTH_MIN = 3;
const SUBDOMAIN_LENGTH_MAX = 12;

const RnsNameState = {
  UNCHECKED: 0,
  AVAILABLE: 1,
  UNAVAILABLE: 2,
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: color.black,
    marginBottom: 20,
  },
  body: {
    marginHorizontal: 20,
    marginTop: 20,
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
  textInput: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
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
  },
  rnsRowChevron: {
    fontSize: 30,
    color: '#CBC6C6',
    position: 'absolute',
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

const shortAddress = (address) => {
  const prefix = address.substr(0, 6);
  const suffix = address.substr(address.length - 4, address.length - 1);
  const result = `${prefix}...${suffix}`;
  return result;
};

const getTokens = (wallets) => {
  const tokens = [];
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
    console.log('this.tokens: ', this.tokens);
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
    const regex = /^[a-z0-9]*$/g;
    const match = regex.exec(text);
    if (!match) {
      return;
    }
    rnsRows[index].name = text;
    delete rnsRows[index].isDomainValid;
    this.setState({ rnsRows: [...rnsRows] });
  }

  onCreatePressed = async () => {
    const { addNotification, addConfirmation } = this.props;
    const { rnsRows } = this.state;
    // const user = await parse.getUser();
    // const fcmToken = user ? user.get('fcmToken') : null;
    const queryParams = {};
    queryParams.subdomainData = _.map(rnsRows, (row) => {
      const { name, type } = row;
      return { subdomain: name, type };
    });
    this.setState({ isLoading: true });
    const result = await parse.isSubdomainAvailable(queryParams);
    this.setState({ isLoading: false });
    console.log('parse.isSubdomainAvailable, result: ', result);
    let isAllDomainValid = true;
    _.each(result, (item, index) => {
      if (!item) {
        rnsRows[index].rnsNameState = RnsNameState.AVAILABLE;
        isAllDomainValid = false;
      } else {
        rnsRows[index].rnsNameState = RnsNameState.UNAVAILABLE;
      }
    });
    if (isAllDomainValid) {
      const confirmation = createInfoConfirmation(
        'modal.rnsNameCreateConfirm.title',
        'modal.rnsNameCreateConfirm.body',
        this.createSubdomain,
        () => null,
      );
      addConfirmation(confirmation);
    } else {
      const notification = createErrorNotification(
        'modal.rnsNameUnavailable.title',
        'modal.rnsNameUnavailable.body',
        'button.gotIt',
      );
      addNotification(notification);
      this.setState({ rnsRows: [...rnsRows] });
    }
  }

  createSubdomain = async () => {
    const { rnsRows } = this.state;
    const user = await parse.getUser();
    const fcmToken = user ? user.get('fcmToken') : null;
    const params = { fcmToken };
    params.subdomainData = _.map(rnsRows, (row) => {
      const { name, type, address } = row;
      return { subdomain: name, type, address };
    });
    this.setState({ isLoading: true });
    const result = await parse.createSubdomain(params);
    this.setState({ isLoading: false });
    console.log('parse.createSubdomain, result: ', result);
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
      address, balance, symbol, type,
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
    console.log('onSelectionModalConfirmed, selectedIndex: ', selectedIndex);
    const { rnsRows } = this.state;
    const { selectItems } = this.state;
    const { address } = selectItems[selectedIndex];
    rnsRows[this.rnsRowIndex].address = address;
    this.setState({ rnsRows: [...rnsRows] });
  }

  onDeleteButtonPressed = (index) => {
    console.log('onDeleteButtonPressed');
    const { rnsRows } = this.state;
    rnsRows.splice(index, 1);
    this.setState({ rnsRows });
  }

  onRnsNameBlur = (index) => {
    const { rnsRows } = this.state;
    rnsRows[index].errorMessage = null;
    if (rnsRows[index].name > 1 && rnsRows[index].name.length < SUBDOMAIN_LENGTH_MIN) {
      rnsRows[index].errorMessage = 'Name is too short';
    }
    if (rnsRows[index].name > 1 && rnsRows[index].name.length > SUBDOMAIN_LENGTH_MAX) {
      rnsRows[index].errorMessage = 'Name is too long';
    }
    this.setState({ rnsRows: [...rnsRows] });
  }

  renderRnsRow = (item, index) => {
    console.log('renderRnsRow');
    const { address, name } = item;
    const { rnsRows } = this.state;
    const addressText = shortAddress(address);
    const isTouchDisabled = !(index === 0 || rnsRows.length === this.tokens.length);
    const { errorMessage, rnsNameState } = rnsRows[index];
    let message = null;
    if (rnsNameState !== RnsNameState.UNCHECKED) {
      message = rnsNameState === RnsNameState.UNAVAILABLE
        ? <Text style={styles.notice}>Sorry, The name entered is not available</Text>
        : <Text style={styles.successNotice}>The name entered is available</Text>;
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
              <Text style={styles.rnsRowAddress}>{addressText}</Text>
              { isTouchDisabled && <EvilIcons style={styles.rnsRowChevron} name="chevron-down" /> }
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.sectionContainer, space.marginBottom_15]}>
          <Loc style={[styles.title, space.marginBottom_10]} text="page.wallet.rnsCreateName.rnsName" />
          <View style={styles.row}>
            <TextInput
              style={[presetStyle.textInput, styles.textInput, { flex: 1, marginRight: 10 }]}
              value={name}
              onChangeText={(text) => { this.onRnsNameTextChange(text, index); }}
              onBlur={() => { this.onRnsNameBlur(index); }}
              autoCapitalize="none"
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

    const rnsRow = _.find(rnsRows, (row) => !row.name && row.errorMessage);
    const bottomButton = (<Button text="button.create" onPress={this.onCreatePressed} disabled={!!rnsRow} />);
    const selectItemTexts = _.map(selectItems, (item) => shortAddress(item.address));

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
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          )}
        </View>
        <SelectionModal
          items={selectItemTexts}
          ref={(ref) => { this.selectionModal = ref; }}
          onConfirm={this.onSelectionModalConfirmed}
          title={strings('page.wallet.recovery.selectCoin')}
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
  addConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RnsAddress);
