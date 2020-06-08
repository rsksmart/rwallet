import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectionList from '../../components/common/list/selectionList';
import appActions from '../../redux/dapp/actions';
import Header from '../../components/headers/header';
import BasePageGereral from '../base/base.page.general';
import config from '../../../config';
import { strings } from '../../common/i18n';

const styles = StyleSheet.create({
  listView: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
});

class Currency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static getCurrencyIndex(currency, currencyArray) {
      if (!_.isString(currency)) {
        return 0;
      }

      const index = currencyArray.indexOf(currency);

      return index >= 0 ? index : 0;
    }

    constructor(props) {
      super(props);

      // ['ARS', 'USD', 'CNY', 'KRW', 'JRY', 'GBP']
      const currencies = _.map(config.consts.currencies, (item) => item.name);

      this.state = {
        currencyIndex: Currency.getCurrencyIndex(props.currency, currencies),
      };

      this.currencies = currencies;
      this.listData = _.map(config.consts.currencies, (item) => {
        const fullName = `currency.${item.name}`;
        return { title: `${item.name} - ${strings(fullName)}` };
      });

      this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const { currency } = nextProps;
      const { currency: oldCurrency } = this.props;

      const newState = this.state;

      // Update currency index if there's a new currency value from nextProps
      if (currency !== oldCurrency) {
        newState.currencyIndex = Currency.getCurrencyIndex(currency, this.currencies);
      }

      this.setState(newState);
    }

    onChange(index) {
      const { changeCurrency } = this.props;
      changeCurrency(this.currencies[index]);
    }

    render() {
      const { navigation } = this.props;
      const { currencyIndex } = this.state;

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.mine.currency.title" />}
        >
          <View style={styles.listView}>
            <SelectionList data={this.listData} onChange={this.onChange} selected={currencyIndex} />
          </View>
        </BasePageGereral>
      );
    }
}

Currency.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  changeCurrency: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  changeCurrency: (value) => dispatch(appActions.setSingleSettings('currency', value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
