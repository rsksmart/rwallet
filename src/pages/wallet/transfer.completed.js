import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';

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
  }

  onBackPress() {
    const { navigation } = this.props;
    const statckActions = StackActions.popToTop();
    navigation.dispatch(statckActions);
  }

  render() {
    return (
      <View style={[flex.flex1]}>
        <Header
          title="Reset Passcode"
          goBack={this.onBackPress}
        />
        <View style={[screenHelper.styles.body, styles.body]}>
          <View style={styles.content}>
            <Image style={styles.check} source={completed} />
            <Loc style={[styles.title]} text="Transfer Completed!" />
            <Loc style={[styles.text]} text="TransferText" />
            <TouchableOpacity onPress={this.onBackPress}>
              <Loc style={[styles.text, styles.link]} text="Click to view in explorer" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <Button
              text="BACK TO WALLET"
              onPress={this.onBackPress}
            />
          </View>
        </View>
      </View>
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
