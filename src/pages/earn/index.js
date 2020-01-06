import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import EarnHeader, { headerBottomY } from '../../components/common/misc/header.earn';
import Loc from '../../components/common/misc/loc';
import flex from '../../assets/styles/layout.flex';
import RSKad from '../../components/common/rsk.ad';

const headerImage = require('../../assets/images/misc/shaking.hands.png');

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 50,
    marginTop: headerBottomY,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 30,
  },
  greenLine: {
    marginTop: 7,
    marginBottom: 15,
    width: 35,
    height: 3,
    backgroundColor: '#00B520',
    borderRadius: 1.5,
  },
  listText: {
    lineHeight: 25,
  },
});

export default class EarnIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    return (
      <View style={[flex.flex1]}>
        <ScrollView>
          <EarnHeader title="Earn cryptocurrency with ease" imageSource={headerImage} imageBgColor="#A2C4F7" />
          <View style={styles.body}>
            <Loc style={[styles.title]} text="Below features are coming soon to Earn…" />
            <View style={styles.greenLine} />
            <Loc style={[styles.listText]} text="- Earn cryptocurrency by completing task" />
            <Loc style={[styles.listText]} text="- Gain interests from a variety of Defi products" />
            <Loc style={[styles.listText]} text="- Cash Back" />
          </View>
        </ScrollView>
        <RSKad />
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
};
