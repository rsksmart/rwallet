import React, { Component } from 'react';
import {
  View, StyleSheet, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import actions from '../../redux/languageSwitcher/actions';
import Loc from '../../components/common/misc/loc';

const header = require('../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  listView: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 180,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
});

class Language extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    listData = [
      {
        title: 'English',
      },
      {
        title: 'French',
      },
      {
        title: 'Hebrew',
      },
      {
        title: 'Chinese',
      },
    ];

    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
    }

    onChange(index) {
      const { changeLanguage } = this.props;
      const locales = ['en', 'fr', 'he', 'zh'];
      changeLanguage(locales[index]);
    }

    render() {
      const { language } = this.props;
      const selected = {
        en: 0, fr: 1, he: 2, zh: 3,
      }[language];
      return (
        <View style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Language" />
          </ImageBackground>
          <View style={styles.listView}>
            <SelectionList data={this.listData} onChange={this.onChange} selected={selected} />
          </View>
        </View>
      );
    }
}

Language.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  changeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.LanguageSwitcher.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (language) => dispatch(
    actions.changeLanguage(language),
  ),
});

export {
  Language,
};
export default connect(mapStateToProps, mapDispatchToProps)(Language);
