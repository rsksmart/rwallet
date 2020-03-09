import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import presetStyle from '../../assets/styles/style';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color.ts';
import parseHelper from '../../common/parse';

const styles = StyleSheet.create({
  sectionContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    paddingBottom: 20,
  },
  title: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 17,
  },
  body: {
    marginHorizontal: 25,
    marginTop: 13,
  },
});

export default class AddCustomToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
      this.onAddressInputBlur = this.onAddressInputBlur.bind(this);
      this.state = {
        address: '0x345dc961828f9fe7c69da34e88d58839f153784c',
        symbol: '',
        decimals: '',
      };
      this.name = '';
      this.type = 'Testnet';
      this.chain = 'Rootstock';
    }

    async onAddressInputBlur() {
      const { address } = this.state;
      const { type, chain } = this;
      const tokenInfo = await parseHelper.getTokenBasicInfo(type, chain, address);
      console.log('tokenInfo: ', tokenInfo);
      const { name, symbol, decimals } = tokenInfo;
      this.setState({ symbol, decimals });
      this.name = name;
    }

    onPress() {
      const { navigation } = this.props;
      const { address, symbol, decimals } = this.state;
      const { name, type, chain } = this;
      navigation.navigate('AddCustomTokenConfirm', {
        address, symbol, decimals, name, type, chain,
      });
    }

    render() {
      const { navigation } = this.props;
      const { address, symbol, decimals } = this.state;
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader={false}
          bottomBtnText="button.Next"
          bottomBtnOnPress={this.onPress}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addCustomToken.title" />}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.address" />
              <TextInput
                ref={(ref) => { this.nameInput = ref; }}
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={address}
                onBlur={this.onAddressInputBlur}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.symbol" />
              <TextInput
                placeholder="BMT"
                ref={(ref) => { this.nameInput = ref; }}
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={symbol}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.decimals" />
              <TextInput
                placeholder="3"
                ref={(ref) => { this.nameInput = ref; }}
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={decimals.toString()}
              />
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

AddCustomToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
