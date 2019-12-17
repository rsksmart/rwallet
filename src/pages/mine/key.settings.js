import React, { Component } from 'react';
import {
  View, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
import Loc from '../../components/common/misc/loc';


const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    position: 'absolute',
    bottom: 65,
    left: 24,
    color: '#FFF',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '900',
    position: 'absolute',
    bottom: 45,
    left: 24,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 9,
    bottom: 97,
  },
  chevron: {
    color: '#FFF',
  },
  sectionContainer: {
    paddingHorizontal: 30,
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
});

const header = require('../../assets/images/misc/header.png');

class KeySettings extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        walletCount: 3,
      };
    }

    static renderBackButton(navigation) {
      const backButton = (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
        </TouchableOpacity>
      );
      return backButton;
    }


    render() {
      const { navigation } = this.props;
      const { walletCount } = this.state;
      return (
        <ScrollView style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Key Settings" />
            <Text style={[styles.headerText]}>{`This key contains ${walletCount} wallets`}</Text>
            { KeySettings.renderBackButton(navigation) }
          </ImageBackground>
          <View style={screenHelper.styles.body}>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <TouchableOpacity onPress={() => navigation.navigate('KeyName')}>
                <Text>Key Name</Text>
                <Text>Key 1</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Wallets" />
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Security" />
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Advanced" />
            </View>
          </View>
        </ScrollView>
      );
    }
}

KeySettings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(KeySettings);
