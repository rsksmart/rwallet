import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import EarnHeader from '../../components/headers/header.earn';
import Loc from '../../components/common/misc/loc';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';

const headerImage = require('../../assets/images/misc/title.image.earn.png');

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 85,
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
        headerComponent={<EarnHeader title="page.earn.index.title" imageSource={headerImage} imageBgColor="#A2C4F7" />}
      >
        <View style={styles.body}>
          <Loc style={[styles.title]} text="page.earn.index.featuresTitle" />
          <View style={styles.greenLine} />
          <Loc style={[styles.listText]} text="page.earn.index.feature1" />
          <Loc style={[styles.listText]} text="page.earn.index.feature2" />
          <Loc style={[styles.listText]} text="page.earn.index.feature3" />
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
