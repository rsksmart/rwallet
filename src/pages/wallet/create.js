import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import flex from '../../assets/styles/layout.flex';
import Input from '../../components/common/input/input';
import Button from '../../components/common/button/button';
import SwitchListItem from '../../components/common/list/switchListItem';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import walletActions from '../../redux/wallet/actions';

const styles = StyleSheet.create({
  input: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  walletName: {
    fontSize: 20,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 10,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomBorder: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

class WalletCreate extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        walletName: '',
      };
    }

    render() {
      const { walletName } = this.state;
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Create Wallet" goBack={navigation.goBack} />
          <View style={[styles.sectionContainer, styles.bottomBorder, { paddingBottom: 20 }]}>
            <Text style={[styles.sectionTitle, styles.walletName]}>Wallet Name</Text>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({ walletName: text })}
            />
          </View>
          <View style={[styles.sectionContainer, styles.bottomBorder]}>
            <Text style={[styles.sectionTitle]}>Advanced Options</Text>
            <SwitchListItem title="Single address" value={false} />
          </View>
          <View style={[styles.sectionContainer]}>
            <Text style={[styles.sectionTitle]}>Wallet Service URL</Text>
            <Text>https://bws.bitpay.com/bws/api</Text>
          </View>
          <View style={styles.buttonView}>
            <Button
              text="CREATE"
              onPress={async () => {
                const wallet = await walletManager.createWallet(walletName);
                navigation.navigate('RecoveryPhrase', { wallet });
              }}
            />
          </View>
        </View>
      );
    }
}

WalletCreate.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

WalletCreate.defaultProps = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  createWallet: () => dispatch(walletActions.createWallet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletCreate);
