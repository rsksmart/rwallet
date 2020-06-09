import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, TouchableOpacity, StyleSheet, Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tags from '../../components/common/misc/tags';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import common from '../../common/common';
import color from '../../assets/styles/color.ts';

const bip39 = require('bip39');

const styles = StyleSheet.create({
  text: {},
  note: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 45,
    fontWeight: '500',
    letterSpacing: 0.29,
  },
  copy: {
    textAlign: 'center',
    color: color.app.theme,
    fontSize: 15,
  },
  tagsView: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  copyView: {
    marginTop: 10,
    width: 100,
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class RecoveryPhrase extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { navigation } = props;
      const { shouldVerifyPhrase } = navigation.state.params;
      this.state = {
        phrases: [],
      };
      if (_.isNil(shouldVerifyPhrase)) {
        throw new Error('shouldVerifyPhrase is undefined or null.');
      }
      this.bottomBtnText = shouldVerifyPhrase ? 'button.NEXT' : 'button.Finish';
      this.onBottomBtnPress = (shouldVerifyPhrase ? this.onNextPressed : this.onFinishPressed).bind(this);
      this.onCopyPressed = this.onCopyPressed.bind(this);
    }

    async componentDidMount() {
      const { addNotification, navigation } = this.props;

      const { shouldCreatePhrase, phrase } = navigation.state.params;
      if (_.isNil(shouldCreatePhrase)) {
        throw new Error('shouldCreatePhrase is undefined or null.');
      }

      // the page will skip phrase creation if navigation.state.params.shouldCreatePhrase is false explicitly.
      if (shouldCreatePhrase) {
        const entropy = await common.getRandom(16);
        this.phrase = bip39.entropyToMnemonic(entropy);
      } else {
        this.phrase = phrase;
      }
      const phrases = this.phrase.split(' ');
      this.setState({ phrases }, () => {
        const notification = createInfoNotification(
          'modal.guardPhrase.title',
          'modal.guardPhrase.body',
        );
        addNotification(notification);
      });
    }

    onNextPressed() {
      const { navigation } = this.props;
      const params = { ...navigation.state.params, phrase: this.phrase };
      navigation.navigate('VerifyPhrase', params);
    }

    onFinishPressed() {
      const { navigation } = this.props;
      navigation.goBack();
    }

    onCopyPressed() {
      const { phrase } = this;
      const { addNotification } = this.props;
      Clipboard.setString(phrase);
      const notification = createInfoNotification(
        'modal.phraseCopied.title',
        'modal.phraseCopied.body',
      );
      addNotification(notification);
    }

    render() {
      const { phrases } = this.state;
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          bottomBtnText={this.bottomBtnText}
          bottomBtnOnPress={this.onBottomBtnPress}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.recoveryPhrase.title" />}
        >
          <Loc style={[styles.note, { marginTop: 15 }]} text="page.wallet.recoveryPhrase.note1" />
          <Loc style={[styles.note]} text="page.wallet.recoveryPhrase.note2" />
          <Loc style={[styles.note]} text="page.wallet.recoveryPhrase.note3" />
          <View style={styles.tagsView}>
            <Tags data={phrases} style={[{ justifyContent: 'center' }]} />
          </View>
          <TouchableOpacity style={styles.copyView} onPress={this.onCopyPressed}>
            <Loc style={[styles.copy]} text="button.Copy" />
          </TouchableOpacity>
        </BasePageGereral>
      );
    }
}

RecoveryPhrase.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecoveryPhrase);
