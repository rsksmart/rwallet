import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import SelectionList from '../../components/common/list/selectionList';
import actions from '../../redux/app/actions';
import Header from '../../components/headers/header';
import { strings } from '../../common/i18n';
import BasePageGereral from '../base/base.page.general';

import config from '../../../config';

const { consts: { locales } } = config;

const localeIds = _.map(locales, 'id');

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

    static createListData() {
      const listData = _.map(locales, (row) => ({ title: strings(`language.${row.name}`) }));
      return listData;
    }

    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
      this.state = { listData: [] };
    }

    componentDidMount() {
      const listData = Language.createListData();
      this.setState({ listData });
    }

    componentWillReceiveProps(nextProps) {
      const { currentLocale: nextLocale } = nextProps;
      const { currentLocale } = this.props;
      if (currentLocale !== nextLocale) {
        const listData = Language.createListData();
        this.setState({ listData });
      }
    }

    onChange(index) {
      const { changeLanguage } = this.props;
      changeLanguage(localeIds[index]);
    }

    render() {
      const { navigation, currentLocale } = this.props;
      const { listData } = this.state;

      // Get index of current selected locale string; default 0
      let selectedIndex = _.indexOf(localeIds, currentLocale);
      selectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.mine.language.title" />}
        >
          <View style={styles.listView}>
            <SelectionList data={listData} onChange={this.onChange} selected={selectedIndex} />
          </View>
        </BasePageGereral>
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
  currentLocale: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  changeLanguage: (value) => dispatch(
    actions.changeLanguage(value),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);
