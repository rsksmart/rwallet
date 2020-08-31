import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/headers/header';
import Switch from '../../components/common/switch/switch';
import appActions from '../../redux/app/actions';
import BasePageGereral from '../base/base.page.general';
import common from '../../common/common';
import { BIOMETRY_TYPES } from '../../common/constants';
import color from '../../assets/styles/color';

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    width: '85%',
  },
  title: {
    color: color.mineShaft,
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
    borderBottomColor: color.grayED,
  },
});

class TwoFactorAuth extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);

      this.onResetPasscodePress = this.onResetPasscodePress.bind(this);
      this.setSingleSettings = this.setSingleSettings.bind(this);

      const { fingerprint } = this.props;

      this.state = {
        biometryType: null,
        isOpen: !!fingerprint,
      };
    }

    async componentDidMount() {
      const biometryType = await common.getBiometryType();
      this.setState({ biometryType });
    }

    onResetPasscodePress() {
      const { passcode, showPasscode, navigation } = this.props;
      if (passcode) {
        showPasscode('reset', () => navigation.navigate('ResetPasscodeSuccess', { operation: 'reset' }));
      } else {
        showPasscode('create', () => navigation.navigate('ResetPasscodeSuccess', { operation: 'create' }));
      }
    }

    setSingleSettings(value) {
      const { isOpen } = this.state;
      const { setSingleSettings, fingerprint, showFingerprintModal } = this.props;

      // Open when user clicked. If user auth verify failed or cancel auth verify, will close the fingerprint switch
      this.setState({ isOpen: !isOpen });
      if (!fingerprint) {
        showFingerprintModal(() => {
          setSingleSettings('fingerprint', value);
        }, () => {
          // Close the fingerprint switch when user verify failed or cancel
          this.setState({ isOpen: false });
        }, true);
      } else {
        setSingleSettings('fingerprint', value);
      }
    }

    getBiometryText = (biometryType) => {
      const prefix = 'page.mine.2fa';
      const suffix = {
        [BIOMETRY_TYPES.FACE_ID]: 'useFaceID',
        [BIOMETRY_TYPES.TOUCH_ID]: 'useFingerprint',
        [BIOMETRY_TYPES.Biometrics]: 'useBiometrics',
      };
      return `${prefix}.${suffix[biometryType]}`;
    }

    render() {
      const { isOpen } = this.state;
      const { navigation, passcode } = this.props;
      const { biometryType } = this.state;
      const setPasscodeText = passcode ? 'page.mine.2fa.resetPasscode' : 'page.mine.2fa.setPasscode';

      let useFingerSwitchRow = null;
      // Show use fingerprint switch row if fingerprint is available.

      if (biometryType) {
        const text = this.getBiometryText(biometryType);
        useFingerSwitchRow = (
          <View style={styles.row}>
            <Loc style={[styles.title]} text={text} />
            <Switch
              value={isOpen}
              onValueChange={this.setSingleSettings}
            />
          </View>
        );
      }

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.mine.2fa.title" />}
        >
          <View style={styles.body}>
            <TouchableOpacity style={styles.row} onPress={this.onResetPasscodePress}>
              <Loc style={[styles.title]} text={setPasscodeText} />
              <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
            </TouchableOpacity>
            {useFingerSwitchRow}
          </View>
        </BasePageGereral>
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
  showPasscode: PropTypes.func.isRequired,
  fingerprint: PropTypes.bool,
  passcode: PropTypes.string,
  showFingerprintModal: PropTypes.func.isRequired,
};


TwoFactorAuth.defaultProps = {
  setSingleSettings: undefined,
  fingerprint: undefined,
  passcode: undefined,
};

const mapStateToProps = (state) => ({
  fingerprint: state.App.get('fingerprint'),
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  setSingleSettings: (key, value) => dispatch(appActions.setSingleSettings(key, value)),
  showPasscode: (category, callback) => dispatch(
    appActions.showPasscode(category, callback),
  ),
  showFingerprintModal: (callback, fallback, fingerprintPasscodeDisabled) => dispatch(
    appActions.showFingerprintModal(callback, fallback, fingerprintPasscodeDisabled),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorAuth);
