import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';

const styles = StyleSheet.create({
  headerBoard: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#0f192f',
    alignSelf: 'center',
    marginTop: 20,
  },
  giftcardView: {
    width: '100%',
    padding: 5,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftcard: {
    marginLeft: 15,
  },
  chevron: {
    color: '#FFF',
  },
});

const shapeshift = require('../../assets/images/misc/shapeshift.png');

class EarnIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { addNotification } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          title="Earn"
        />
        <View style={[screenHelper.styles.body, { flex: 1, marginHorizontal: 30 }]}>
          <Text>Service</Text>
          <View style={[styles.headerBoard]}>
            <TouchableOpacity
              style={[{ alignSelf: 'center', width: '100%', marginTop: 10 }]}
              onPress={() => {
                const notification = createInfoNotification(
                  'ShapeShift',
                  'This feature is coming soon',
                );
                addNotification(notification);
              }}
            >
              <View style={styles.giftcardView}>
                <View style={{ flex: 1 }}>
                  <Image style={styles.giftcard} source={shapeshift} />
                </View>
                <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

EarnIndex.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(EarnIndex);
