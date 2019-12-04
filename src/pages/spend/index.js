import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  headerBoard: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    marginTop: 30,
  },
  giftcardView: {
    width: '100%',
    borderColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.component.iconList.borderBottomColor,
  },
  giftcard: {
    width: '100%',
  },
  buttonText: {
    color: '#6FC062',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.25,
    paddingVertical: 15,
    alignSelf: 'center',
  },
});

const giftcard = require('../../assets/images/misc/giftcard.png');

class SpendIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { addNotification } = this.props;
    return (
      <View>
        <Header
          title="Spend"
        />
        <View style={screenHelper.styles.body}>
          <View style={[styles.headerBoard]}>
            <TouchableOpacity
              style={[{ alignSelf: 'center', width: '95%', marginTop: 10 }]}
              onPress={() => {
                const notification = createInfoNotification(
                  'Buy Gift Cards',
                  'This feature is coming soon',
                );
                addNotification(notification);
              }}
            >
              <View style={styles.giftcardView}>
                <Image style={styles.giftcard} source={giftcard} />
              </View>
              <Text style={[styles.buttonText]}>Buy Gift Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

SpendIndex.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SpendIndex);
