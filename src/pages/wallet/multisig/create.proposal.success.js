import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import Header from '../../../components/headers/header';
import BasePageSimple from '../../base/base.page.simple';
import Button from '../../../components/common/button/button';
import { strings } from '../../../common/i18n';
import operationSuccessStyles from '../../../assets/styles/operation.success.style';
import color from '../../../assets/styles/color';
import CompletedIcon from '../../../components/common/image/completed.icon';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  title: {
    fontSize: screenWidth > 400 ? 24 : 22,
    color: color.black,
    fontFamily: 'Avenir-Book',
    textAlign: 'center',
  },
});

class CreateProposalSuccess extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onBackButtonPressed = () => {
      const { navigation } = this.props;
      const stackActions = StackActions.pop({ n: 2 });
      navigation.dispatch(stackActions);
      navigation.navigate('Home');
    }

    render() {
      return (
        <BasePageSimple
          isSafeView
          hasBottomBtn
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPressed} title="page.wallet.proposal.title" />}
        >
          <View style={operationSuccessStyles.wrapper}>
            <View style={operationSuccessStyles.content}>
              <View style={operationSuccessStyles.centerView}>
                <CompletedIcon style={operationSuccessStyles.check} />
                <Text style={styles.title}>{strings('page.wallet.proposal.created')}</Text>
              </View>
            </View>
            <Button style={operationSuccessStyles.button} text="button.goToWallet" onPress={this.onBackButtonPressed} />
          </View>
        </BasePageSimple>
      );
    }
}

CreateProposalSuccess.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps, null)(CreateProposalSuccess);
