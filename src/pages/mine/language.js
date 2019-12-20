import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import actions from '../../redux/app/actions';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';

import config from '../../../config';

const { consts: { languages: locales } } = config;

const styles = StyleSheet.create({
  listView: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
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
      changeLanguage(locales[index]);
    }

    render() {
      const { navigation, language } = this.props;
      const selected = {
        en: 0, fr: 1, he: 2, zh: 3,
      }[language];
      return (
        <ScrollView style={[flex.flex1]}>
          <Header
            title="Language"
            goBack={() => {
              navigation.goBack();
            }}
          />
          <View style={screenHelper.styles.body}>
            <View style={styles.listView}>
              <SelectionList data={this.listData} onChange={this.onChange} selected={selected} />
            </View>
          </View>
        </ScrollView>
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
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (value) => dispatch(
    actions.setSingleSettings('language', value),
  ),
});

export {
  Language,
};
export default connect(mapStateToProps, mapDispatchToProps)(Language);
