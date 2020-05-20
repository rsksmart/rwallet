import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import EarnHeader from '../../components/headers/header.earn';
import Loc from '../../components/common/misc/loc';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color.ts';

const headerImage = require('../../assets/images/misc/title.image.spend.png');

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
    backgroundColor: color.app.theme,
    borderRadius: 1.5,
  },
  listText: {
    lineHeight: 25,
  },
});

class SpendIndex extends Component {
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
        headerComponent={<EarnHeader title="page.spend.index.title" imageSource={headerImage} imageBgColor="#61DABF" />}
      >
        <TouchableOpacity>
          <View style={styles.body}>
            <Loc style={[styles.title]} text="page.spend.index.featuresTitle" />
            <View style={styles.greenLine} />
            <Loc style={[styles.listText]} text="page.spend.index.feature1" />
            <Loc style={[styles.listText]} text="page.spend.index.feature2" />
            <Loc style={[styles.listText]} text="page.spend.index.feature3" />
          </View>
        </TouchableOpacity>
      </BasePageGereral>
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
};

export default SpendIndex;
