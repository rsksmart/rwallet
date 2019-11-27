import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Loc from './loc';

const header = require('../../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 70,
  },
  headerView: {
    position: 'absolute',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    position: 'absolute',
    top: 132,
    left: 24,
    color: '#FFF',
  },
  chevron: {
    color: '#FFF',
  },
  headerImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
});

export default function Header({ title, goBack }) {
  let backButton = null;
  if (goBack) {
    backButton = (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          goBack();
        }}
      >
        <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.container]}>
      <Image source={header} style={[styles.headerImage]} />
      <View style={styles.headerView}>
        <Loc style={[styles.headerTitle]} text={title} key={`${Math.random()}`} />
        {backButton}
      </View>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func,
};

Header.defaultProps = {
  goBack: null,
};
