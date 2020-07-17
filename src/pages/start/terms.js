import React, { Component } from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../components/common/button/button';
import Loc from '../../components/common/misc/loc';
import TermRow from './term.row';
import SafeAreaView from '../../components/common/misc/safe.area.view';
import screenHelper from '../../common/screenHelper';
import WebViewModal from '../../components/common/webview.modal';
import { strings } from '../../common/i18n';
import config from '../../../config';
import color from '../../assets/styles/color';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '18%',
  },
  buttonView: {
    position: 'absolute',
    bottom: screenHelper.bottomButtonMargin,
  },
  completeTerms: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeTermsText: {
    marginBottom: 10,
    color: color.app.theme,
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
class TermsPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      isTermsWebViewVisible: false,
    };
  }

  onButtonPressed = () => {
    const { navigation } = this.props;
    navigation.navigate('PrimaryTabNavigator');
  }

  onViewTermsPressed = () => {
    this.setState({ isTermsWebViewVisible: true });
  }

  render() {
    const { isTermsWebViewVisible } = this.state;
    return (
      <SafeAreaView>
        <View style={styles.page}>
          <Image style={styles.logo} source={logo} />
          <View style={styles.termsView}>
            <View style={styles.termsView2}>
              <TermRow text="page.start.terms.term1" delay={0} />
              <TermRow text="page.start.terms.term2" delay={0.5} />
              <TermRow text="page.start.terms.term3" delay={1} />
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.completeTerms} onPress={this.onViewTermsPressed}>
              <Loc style={[styles.completeTermsText]} text="page.start.terms.viewTerms" />
            </TouchableOpacity>
            <Button
              style={styles.button}
              text="page.start.terms.button"
              onPress={this.onButtonPressed}
            />
          </View>
        </View>
        <WebViewModal
          title={strings('page.start.terms.termsOfUse')}
          url={config.termsUrl}
          visible={isTermsWebViewVisible}
          onBackButtonPress={() => { this.setState({ isTermsWebViewVisible: false }); }}
        />
      </SafeAreaView>
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


const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(TermsPage);
