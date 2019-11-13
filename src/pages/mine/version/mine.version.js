import React, { Component } from 'react';
import {
  View, Text, Alert, TouchableOpacity, Platform, SafeAreaView, Linking,
} from 'react-native';
import PropTypes from 'prop-types';

import ImageBtnStateless from '../../../components/common/buttons/image.btn.stateless';
import flex from '../../../assets/styles/layout.flex';
import color from '../../../assets/styles/color.ts';
import common from '../../../common/common';


class MineVersion extends Component {
    static navigationOptions = () => ({
      headerTitle: 'Version',
    });

    handleOpenUrl = () => {
      const url = Platform.OS === 'ios' ? 'itms-apps://https://itunes.apple.com/app/id414478124?action=write-review' : 'market://details?id=com.tencent.mm';
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        console.warn(`Can't handle url: ${url}`);
        return null;
      }).catch((err) => console.error('An error occurred', err));
    };

    gotNewestVersion = async () => {
      const hasNewVersion = true;
      if (hasNewVersion) {
        Alert.alert('', 'There is updating, do you want to update?', [
          {
            text: 'cancel',
            onPress: () => {},
          },
          {
            text: 'OK',
            onPress: () => { this.handleOpenUrl(); },
          },
        ]);
      } else {
        Alert.alert('', 'Your APP is up to date');
      }
    };

    render() {
      const { navigation } = this.props;
      const iphonexMargin = common.isIphoneX() ? 20 : 0;

      return (
        <SafeAreaView style={[flex.flex1]}>
          <View style={[color.bg.white, flex.justifyBetween, flex.flex1]}>
            <View style={[flex.justifyCenter]}>
              <View style={[flex.justifyCenter, flex.alignCenter]}>
                {
                  /* <Image source={require('../../../assets/images/my/logo.png')}
                  style={{width: 107,height: 106,resizeMode: 'contain',marginTop: 45}}/> */
                }
              </View>
              <View style={[flex.row, flex.alignCenter, flex.justifyCenter, { marginTop: 10 }]}>
                <Text style={{
                  fontSize: 15, color: '#666', lineHeight: 30, textAlign: 'center',
                }}
                >
0.0.0.1
                </Text>
              </View>
              <View style={[flex.row, flex.alignCenter, flex.justifyCenter, { marginTop: '1.8%' }]}>
                <View style={[flex.row]}>
                  <View style={[flex.flex2]} />
                  <View style={[flex.flex1, flex.justifyCenter]}>
                    <ImageBtnStateless onPress={this.gotNewestVersion} text="Updating" height={32} />
                  </View>
                  <View style={[flex.flex2]} />
                </View>
              </View>
            </View>
            <View style={{ marginBottom: 40, alignItems: 'center', paddingBottom: iphonexMargin }}>
              <View style={[flex.row, flex.justifyCenter]}>
                <View style={[{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                  <TouchableOpacity onPress={() => { navigation.navigate('MyUserAgreement'); }}><Text style={{ fontSize: 14, color: '#333' }}>Terms  </Text></TouchableOpacity>
                  <Text style={{
                    fontSize: 14, color: '#333', textAlign: 'center', lineHeight: 30,
                  }}
                  >
|  Copyright
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }
}

export default MineVersion;

MineVersion.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
