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

const Mnemonic = require('bitcore-mnemonic');

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
    color: '#00B520',
    fontSize: 15,
  },
  tagsView: {
    marginTop: 15,
    marginHorizontal: 20,
  },
});

class RecoveryPhrase extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.phrase = new Mnemonic('', Mnemonic.Words.ENGLISH).toString();
      const phrases = this.phrase.split(' ');
      this.state = {
        phrases,
      };
      this.onNextPress = this.onNextPress.bind(this);
      this.onCopyPress = this.onCopyPress.bind(this);
    }

    componentDidMount() {
      const { addNotification } = this.props;
      const notification = createInfoNotification(
        'Recovery Phrase',
        'Safeguard your recovery phrase Text',
      );
      addNotification(notification);
    }

    onNextPress() {
      const { navigation } = this.props;
      const params = { ...navigation.state.params, phrase: this.phrase };
      navigation.navigate('VerifyPhrase', params);
    }

    onCopyPress() {
      const { phrase } = this;
      const { addNotification } = this.props;
      Clipboard.setString(phrase);
      const notification = createInfoNotification(
        'Copied',
        'The recovery phrase has been copied to clipboard',
      );
      addNotification(notification);
    }

    render() {
      const { phrases } = this.state;
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          title="Recovery Phrase"
          navigation={navigation}
          hasBottomBtn
          bottomBtnText="NEXT"
          bottomBtnOnPress={this.onNextPress}
          hasLoader={false}
        >
          <Loc style={[styles.note, { marginTop: 15 }]} text="Write down or copy these words" />
          <Loc style={[styles.note]} text="in the right order and save them" />
          <Loc style={[styles.note]} text="somewhere safe" />
          <View style={styles.tagsView}>
            <Tags data={phrases} style={[{ justifyContent: 'center' }]} />
          </View>
          <TouchableOpacity style={{ marginTop: 10 }} onPress={this.onCopyPress}>
            <Loc style={[styles.copy]} text="Copy" />
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
