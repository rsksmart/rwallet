import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import actions from '../../redux/languageSwitcher/actions';

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 80,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  listView: {
    width: '80%',
    alignSelf: 'center',
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
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Language" goBack={navigation.goBack} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Language);
