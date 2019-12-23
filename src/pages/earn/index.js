import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import AutoHeightImage from 'react-native-auto-height-image';
import Header from '../../components/common/misc/header';
import FullWidthImage from '../../components/common/misc/full.width.image';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';
import { DEVICE } from '../../common/info';
import Loc from '../../components/common/misc/loc';

const giftcard = require('../../assets/images/misc/giftcard.png');
const shapeshift = require('../../assets/images/misc/shapeshift.png');

const BOARD_MARGIN_OFFSET = -86;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 20,
  },
  board: {
    width: '100%',
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
  giftcardBoard: {
    marginTop: DEVICE.isIphoneX ? BOARD_MARGIN_OFFSET + screenHelper.iphoneXExtendedHeight : BOARD_MARGIN_OFFSET,
    flexDirection: 'row',
  },
  giftcardTouchable: {
    alignSelf: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  giftcardView: {
    width: '100%',
    borderColor: color.component.iconList.borderBottomColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.component.iconList.borderBottomColor,
    paddingVertical: 20,
  },
  buttonText: {
    color: '#6FC062',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.25,
    paddingVertical: 15,
    alignSelf: 'center',
  },
  shapeshiftView: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#0f192f',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  shapeshift: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    height: 80,
  },
  shapeshiftIcon: {
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
  },
  chevron: {
    color: '#FFF',
  },
});

class EarnIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onGiftCardsPress = this.onGiftCardsPress.bind(this);
    this.onShapeshiftPress = this.onShapeshiftPress.bind(this);
  }

  onGiftCardsPress() {
    const { addNotification } = this.props;
    const notification = createInfoNotification(
      'Buy Gift Cards',
      'This feature is coming soon',
    );
    addNotification(notification);
  }

  onShapeshiftPress() {
    const { addNotification } = this.props;
    const notification = createInfoNotification(
      'ShapeShift',
      'This feature is coming soon',
    );
    addNotification(notification);
  }

  render() {
    return (
      <ScrollView>
        <Header
          title="Earn"
        />
        <View style={[screenHelper.styles.body, styles.body]}>
          <View style={[styles.board, styles.giftcardBoard]}>
            <TouchableOpacity
              style={styles.giftcardTouchable}
              onPress={this.onGiftCardsPress}
            >
              <View style={styles.giftcardView}>
                <FullWidthImage source={giftcard} />
              </View>
              <Loc style={[styles.buttonText]} text="Buy Gift Cards" />
            </TouchableOpacity>
          </View>
          <Loc style={[styles.sectionTitle]} text="Service" />
          <TouchableOpacity
            style={[styles.shapeshiftView]}
            onPress={this.onShapeshiftPress}
          >
            <View style={styles.shapeshift}>
              <AutoHeightImage width={150} style={styles.shapeshiftIcon} source={shapeshift} />
            </View>
            <Entypo name="chevron-small-right" size={40} style={styles.chevron} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
