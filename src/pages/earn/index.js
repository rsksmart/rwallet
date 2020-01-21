import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import EarnHeader from '../../components/common/misc/header.earn';
import Loc from '../../components/common/misc/loc';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';

const headerImage = require('../../assets/images/misc/title.image.earn.png');

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 50,
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
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<EarnHeader title="Earn cryptocurrency with ease" imageSource={headerImage} imageBgColor="#A2C4F7" />}
      >
        <View style={styles.body}>
          <Loc style={[styles.title]} text="Below features are coming soon to Earn…" />
          <View style={styles.greenLine} />
          <Loc style={[styles.listText]} text="- Earn cryptocurrency by completing tasks" />
          <Loc style={[styles.listText]} text="- Gain interests from a variety of Defi products" />
          <Loc style={[styles.listText]} text="- Cash Back" />
        </View>
      </BasePageGereral>
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
