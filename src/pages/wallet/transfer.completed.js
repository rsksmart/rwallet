import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/headers/header';
import common from '../../common/common';
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
    marginTop: 30,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '300',
    width: '80%',
    marginTop: 15,
    textAlign: 'center',
  },
  link: {
    color: '#00B520',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default class TransferCompleted extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
    this.onExplorePress = this.onExplorePress.bind(this);
  }

  onBackPress() {
    const { navigation } = this.props;
    const statckActions = StackActions.popToTop();
    navigation.dispatch(statckActions);
  }

  onExplorePress() {
    const { navigation } = this.props;
    const { symbol, type, hash } = navigation.state.params;
    const url = common.getTransactionUrl(symbol, type, hash);
    Linking.openURL(url);
  }

  render() {
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn
        bottomBtnText="GO TO WALLET"
        bottomBtnOnPress={this.onBackPress}
        hasLoader={false}
        headerComponent={<Header title="Send" onBackButtonPress={this.onBackPress} />}
      >
        <View style={styles.content}>
          <Image style={styles.check} source={completed} />
          <Loc style={[styles.title]} text="Transfer Completed!" />
          <Loc style={[styles.text]} text="TransferText" />
          <TouchableOpacity onPress={this.onExplorePress}>
            <Loc style={[styles.text, styles.link]} text="Click to view in explorer" />
          </TouchableOpacity>
        </View>
      </BasePageGereral>
    );
  }
}

TransferCompleted.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
