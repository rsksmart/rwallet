import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';
import Tags from '../../components/common/misc/tags';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';

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
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
});

class RecoveryPhrase extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.wallet = props.navigation.state.params.wallet;
      const phrases = this.wallet.mnemonic.phrase.split(' ');
      this.state = {
        phrases,
      };
    }

    componentDidMount() {
      const { addNotification } = this.props;
      const notification = createInfoNotification(
        'Recovery Phrase',
        'Safeguard your recovery phrase Text',
      );
      addNotification(notification);
    }

    render() {
      const { phrase } = this.wallet.mnemonic;
      const { phrases } = this.state;
      const { navigation, addNotification } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header
            title="Recovery Phrase"
            goBack={() => {
              navigation.goBack();
            }}
          />
          <View style={[screenHelper.styles.body, flex.flex1]}>
            <Loc style={[styles.note, { marginTop: 15 }]} text="Write down or copy these words" />
            <Loc style={[styles.note]} text="in the right order and save them" />
            <Loc style={[styles.note]} text="somewhere safe" />
            <View style={styles.tagsView}>
              <Tags data={phrases} />
            </View>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => {
                Clipboard.setString(phrase);
                const notification = createInfoNotification(
                  'tip',
                  'Phrase is copied to clipboard',
                );
                addNotification(notification);
              }}
            >
              <Text style={styles.copy}>Copy</Text>
            </TouchableOpacity>
            <View style={styles.buttonView}>
              <Button
                text="NEXT"
                onPress={async () => {
                  navigation.navigate('VerifyPhrase', { wallet: this.wallet });
                }}
              />
            </View>
          </View>
        </View>
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
