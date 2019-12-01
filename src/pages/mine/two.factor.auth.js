import React, { Component } from 'react';
import {
  View, StyleSheet, Switch, TouchableOpacity, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import appContext from '../../common/appContext';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    width: '85%',
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
      const { fingerprint } = appContext.data.settings;
      this.state = {
        fingerprint,
        loading: false,
      };
    }

    async goBack() {
      const { fingerprint } = this.state;
      const { navigation } = this.props;
      this.setState({ loading: true });
      await appContext.saveSettings({ fingerprint });
      this.setState({ loading: false });
      navigation.goBack();
    }

    render() {
      const { fingerprint, loading } = this.state;
      const { navigation } = this.props;
      return (
        <ScrollView style={[flex.flex1]}>
          <Header
            title="Two-Factor Authentication"
            goBack={() => {
              navigation.goBack();
            }}
          />
          <View style={[screenHelper.styles.body, styles.body]}>
            <Loader loading={loading} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                navigation.navigate('ResetPasscode');
              }}
            >
              <Loc style={[styles.title]} text="Reset Passcode" />
              <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
            </TouchableOpacity>
            <View style={styles.row}>
              <Loc style={[styles.title]} text="Use Fingerprint" />
              <Switch
                value={fingerprint}
                onValueChange={async (v) => {
                  this.setState({ fingerprint: v });
                  await appContext.saveSettings({ fingerprint: v });
                }}
              />
            </View>
          </View>
        </ScrollView>
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
