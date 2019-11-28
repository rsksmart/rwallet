import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';
import Tags from '../../components/common/misc/tags';
import Button from '../../components/common/button/button';
import Alert from '../../components/common/modal/alert';
import Loc from '../../components/common/misc/loc';

const header = require('../../assets/images/misc/header.png');

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
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
});

export default class RecoveryPhrase extends Component {
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
      this.alert.setModalVisible(true);
    }

    render() {
      const { phrases } = this.state;
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Recovery Phrase" />
          </ImageBackground>
          <Loc style={[styles.note, { marginTop: 200 }]} text="Write down or copy these words" />
          <Loc style={[styles.note]} text="in the right order and save them" />
          <Loc style={[styles.note]} text="somewhere safe" />
          <View style={styles.tagsView}>
            <Tags data={phrases} />
          </View>
          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {}}>
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
          <Alert ref={(ref) => { this.alert = ref; }} title="Safeguard your recovery phrase" text="Safeguard your recovery phrase Text" />
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
};
