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
    }

    onPress() {
      const { navigation } = this.props;
      navigation.navigate('AddCustomTokenConfirm');
    }

    render() {
      const { navigation } = this.props;
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
