import React from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import { PropTypes } from 'prop-types';
import {
  Icon,
  Input,
  Item,
  View,
} from 'native-base';
import Wallet from 'mellowallet/src/store/models';
import { t } from 'mellowallet/src/i18n';
import { round } from 'mellowallet/src/utils';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#00000050',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 50,
  },
  viewWrapped: {
    backgroundColor: '#EEE',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputText: {
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
  },
  walletList: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  walletItem: {
    paddingTop: 20,
  },
  walletItemTextContainer: {
    flexDirection: 'row',
  },
  walletItemName: {
    fontWeight: 'bold',
  },
});

class WalletsSearchBox extends React.Component {
  constructor() {
    super();
    this.state = {
      inputSearch: '',
      walletsFound: [],
    };
  }

  searchWallet = (text) => {
    this.setState({
      inputSearch: text,
    });
    const walletsFound = this.props.wallets
      .filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    this.setState({ walletsFound });
  }

  render() {
    const walletsFound = this.state.walletsFound.map(item => (
      <TouchableHighlight
        style={styles.walletItem}
        key={item.id}
        onPress={() => {
          this.setState({
            inputSearch: '',
            walletsFound: [],
          });
          this.props.onSelect(item);
        }}
        underlayColor="#FFF"
      >
        <View style={styles.walletItemTextContainer}>
          <Text style={styles.walletItemName}>{item.name}</Text>
          <Text>{` ${item.network} / ${item.balance.fiat_unit} ${round(item.balance.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}</Text>
        </View>
      </TouchableHighlight>
    ));
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.viewWrapped}>
            <Item style={styles.inputText}>
              <Icon active name="search" />
              <Input
                autoFocus
                value={this.state.inputSearch}
                placeholder={t('Search')}
                onChangeText={text => this.searchWallet(text)}
              />
              <TouchableHighlight onPress={this.props.onClose}>
                <Icon active name="close" />
              </TouchableHighlight>
            </Item>
            <View style={styles.walletList}>
              {walletsFound}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

WalletsSearchBox.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)),
  visible: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

WalletsSearchBox.defaultProps = {
  visible: false,
  wallets: [],
};


export default WalletsSearchBox;
