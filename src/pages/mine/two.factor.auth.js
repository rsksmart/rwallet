import React, { Component } from 'react';
import {
  View, StyleSheet, Switch, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import appContext from '../../common/appContext';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';

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
      const { fingerprint } = appContext.data.settings;
      this.state = {
        fingerprint,
        loading: false,
      };
    }

    render() {
      const { fingerprint, loading } = this.state;
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header
            title="2FA"
            goBack={async () => {
              this.setState({ loading: true });
              await appContext.saveSettings({ fingerprint });
              this.setState({ loading: false });
              navigation.goBack();
            }}
          />
          <View style={styles.body}>
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
                onValueChange={(v) => {
                  this.setState({ fingerprint: v });
                }}
              />
            </View>
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
