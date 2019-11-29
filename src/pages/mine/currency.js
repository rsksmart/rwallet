import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flex from '../../assets/styles/layout.flex';
import SelectionList from '../../components/common/list/selectionList';
import appActions from '../../redux/app/actions';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';

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

    listData = [
      {
        title: 'ARS - Argentine Peso',
      },
      {
        title: 'USD - US Dollar',
      },
      {
        title: 'RMB - Chinese Yuan',
      },
      {
        title: 'KRW - South Korea won',
      },
      {
        title: 'JPY - Japanese Yen',
      },
      {
        title: 'GBP - Pound sterling',
      },
    ];

    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
    }

    onChange(index) {
      const { changeCurrency } = this.props;
      const currencys = ['ARS', 'USD', 'RMB', 'KRW', 'JRY', 'GBP'];
      changeCurrency(currencys[index]);
    }

    render() {
      const { navigation, currency } = this.props;
      const selected = {
        ARS: 0, USD: 1, RMB: 2, KRW: 3, JRY: 4, GBP: 5,
      }[currency];
      return (
        <ScrollView style={[flex.flex1]}>
          <Header
            title="Currency"
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
});

const mapDispatchToProps = (dispatch) => ({
  changeCurrency: (currency) => dispatch(
    appActions.changeCurrency(currency),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
