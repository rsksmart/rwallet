import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { screen } from '../../common/info';
import flex from '../../assets/styles/layout.flex';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color';

import updateBanner from '../../assets/images/root/update/banner.update.png';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.blackA30,
    height: screen.height,
    width: screen.width,
  },
});

class UpdateModal extends Component {
  static immediateUpdate() {
    const url = Platform.OS === 'ios' ? 'itms-apps://https://itunes.apple.com/app/id414478124?action=write-review' : 'market://details?id=com.tencent.mm';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        console.warn(`Can't handle url: ${url}`);
        return null;
      })
      .catch((err) => console.error('An error occurred', err));
  }

  constructor(props) {
    super(props);
    this.state = {
      showUpdate: props.showUpdate,
      isMandatory: props.mandatory,
    };
  }

  render() {
    const { showUpdate, isMandatory } = this.state;
    return (
      <Modal visible={showUpdate} transparent onRequestClose={() => {}}>
        <View style={[flex.flex1, styles.container]}>
          <View style={[space.marginBottom_5, { width: 0.8 * screen.width }]}>
            <Image
              source={updateBanner}
              style={{ width: 0.8 * screen.width, height: 0.348 * screen.width }}
            />
            <View
              style={[
                {
                  backgroundColor: color.white,
                  width: 0.8 * screen.width,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                },
                flex.alignCenter,
              ]}
            >
              <Text
                style={{
                  color: color.godgerBlue,
                  fontSize: 20,
                  fontWeight: 'bold',
                  justifyContent: 'center',
                }}
              >
                Updating
              </Text>
              <View style={{ marginBottom: 65 }} />
              <View
                style={{
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: color.gallery,
                  height: 60,
                  width: 0.8 * screen.width,
                  position: 'absolute',
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    height: 60,
                    width: 0.8 * screen.width,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  {isMandatory ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showUpdate: false });
                      }}
                      style={{
                        height: 40,
                        maxWidth: 0.5 * screen.width,
                        marginHorizontal: 10,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          maxWidth: 0.5 * screen.width,
                          alignItems: 'center',
                          borderRadius: 20,
                          justifyContent: 'center',
                          backgroundColor: color.gallery,
                          flex: 1,
                        }}
                      >
                        <Text style={{ color: color.doveGray }}>Update Later</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => { UpdateModal.immediateUpdate(); }}
                    style={{
                      height: 40,
                      maxWidth: 0.5 * screen.width,
                      marginHorizontal: 10,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        height: 40,
                        maxWidth: 0.5 * screen.width,
                        alignItems: 'center',
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: color.godgerBlue,
                        flex: 1,
                      }}
                    >
                      <Text style={{ color: color.white }}>Update Now</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default UpdateModal;

UpdateModal.propTypes = {
  showUpdate: PropTypes.bool.isRequired,
  mandatory: PropTypes.bool.isRequired,
};
