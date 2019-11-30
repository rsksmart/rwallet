import React, { Component } from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import TermRow from './term.row';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '10%',
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
  },
  completeTerms: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeTermsText: {
    marginBottom: 10,
    color: '#00B520',
  },
  termsView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsView2: {
    width: '75%',
  },
});
export default class TermsPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    return (
      <View style={styles.page}>
        <Image style={styles.logo} source={logo} />
        <View style={styles.termsView}>
          <View style={styles.termsView2}>
            <TermRow
              text="TermsLine1"
              delay={0}
            />
            <TermRow
              text="TermsLine2"
              delay={0.5}
            />
            <TermRow text="TermsLine3" delay={1} />
          </View>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.completeTerms}>
            <Loc style={[styles.completeTermsText]} text="View Complete Terms Of Use" />
          </TouchableOpacity>
          <Button
            style={styles.button}
            text="COMFIRM & FINISH"
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate('PrimaryTabNavigator');
            }}
          />
        </View>
      </View>
    );
  }
}

TermsPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
