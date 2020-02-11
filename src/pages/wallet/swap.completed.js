import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity,
  // Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loc from '../../components/common/misc/loc';
import SwapHeader from '../../components/headers/header.swap';
// import common from '../../common/common';
import BasePageGereral from '../base/base.page.general';

const completed = require('../../assets/images/icon/completed.png');

const styles = StyleSheet.create({
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: -330,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  check: {
    marginTop: 125,
    marginBottom: 45,
  },
  title: {
    color: '#000000',
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
  },
  text: {
    color: '#4A4A4A',
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    marginTop: 15,
  },
  link: {
    color: '#00B520',
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    marginTop: 15,
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  rightButton: {
    color: '#FFF',
  },
  bottomView: {
    height: 30,
    backgroundColor: '#FFF',
    width: '100%',
    position: 'absolute',
    bottom: -10,
  },
  viewExplorer: {
    marginBottom: 30,
  },
});

export default class SwapCompleted extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static onExplorePress() {
    // const { navigation } = this.props;
    // const { symbol, type, hash } = navigation.state.params;
    // const url = common.getTransactionUrl(symbol, type, hash);
    // Linking.openURL(url);
  }

  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
    // this.onExplorePress = this.onExplorePress.bind(this);
  }

  onBackPress() {
    const { navigation } = this.props;
    const statckActions = StackActions.popToTop();
    navigation.dispatch(statckActions);
  }

  render() {
    const { navigation } = this.props;
    const rightButton = (
      <TouchableOpacity onPress={() => null}>
        <MaterialCommunityIcons style={styles.rightButton} name="progress-clock" size={30} />
      </TouchableOpacity>
    );
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn
        bottomBtnText="button.goToWallet"
        bottomBtnOnPress={this.onBackPress}
        hasLoader={false}
        headerComponent={<SwapHeader title="page.wallet.swapCompleted.title" onBackButtonPress={() => navigation.goBack()} rightButton={rightButton} />}
      >
        <View style={styles.content}>
          <Image style={styles.check} source={completed} />
          <Loc style={[styles.title]} text="page.wallet.swapCompleted.body" />
          <Loc style={[styles.text]} text="page.wallet.swapCompleted.note" />
          <TouchableOpacity style={styles.viewExplorer} onPress={SwapCompleted.onExplorePress}>
            <Loc style={[styles.link]} text="page.wallet.swapCompleted.viewExplorer" />
          </TouchableOpacity>
          <View style={[styles.bottomView]} />
        </View>
      </BasePageGereral>
    );
  }
}

SwapCompleted.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
