import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Switch, TouchableOpacity, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';

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

class TwoFactorAuth extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);

      this.goBack = this.goBack.bind(this);
      this.setSingleSettings = this.setSingleSettings.bind(this);
    }

    setSingleSettings(value) {
      const { setSingleSettings } = this.props;

      setSingleSettings('fingerprint', value);
    }

    goBack() {
      const { navigation } = this.props;
      navigation.goBack();
    }

    render() {
      const { navigation, fingerprint, loading } = this.props;
      return (
        <ScrollView style={[flex.flex1]}>
          <Header
            title="Two-Factor Authentication"
            goBack={this.goBack}
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
                onValueChange={this.setSingleSettings}
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
  setSingleSettings: PropTypes.func,
  fingerprint: PropTypes.bool,
  loading: PropTypes.bool,
};


TwoFactorAuth.defaultProps = {
  setSingleSettings: undefined,
  fingerprint: undefined,
  loading: false,
};

const mapStateToProps = (state) => ({
  loading: state.App.get('isPageLoading'),
  fingerprint: state.App.get('settings') && state.App.get('settings').get('fingerprint'),
});

const mapDispatchToProps = (dispatch) => ({
  setSingleSettings: (key, value) => dispatch(appActions.setSingleSettings(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorAuth);
