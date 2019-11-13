import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 80,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  body: {
    marginHorizontal: 15,
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
});

export default class TwoFactorAuth extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        fingerprint: false,
      };
    }

    render() {
      let resetFingerprint = null;
      const { fingerprint } = this.state;
      const { navigation } = this.props;
      if (fingerprint) {
        resetFingerprint = (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              navigation.navigate('ResetFingerprint');
            }}
          >
            <Text style={styles.title}>Reset Fingerprint</Text>
            <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
          </TouchableOpacity>
        );
      }
      return (
        <View style={[flex.flex1]}>
          <Header title="2FA" goBack={navigation.goBack} />
          <View style={styles.body}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                navigation.navigate('ResetPasscode');
              }}
            >
              <Text style={styles.title}>Reset Passcode</Text>
              <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
            </TouchableOpacity>
            <View style={styles.row}>
              <Text style={styles.title}>Use Fingerprint</Text>
              <Switch
                value={fingerprint}
                onValueChange={(v) => {
                  this.setState({ fingerprint: v });
                }}
              />
            </View>
            {resetFingerprint}
          </View>
        </View>
      );
    }
}

TwoFactorAuth.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
