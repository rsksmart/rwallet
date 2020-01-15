import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
import Header from '../../components/common/misc/header';
import Loc from '../../components/common/misc/loc';
import Button from '../../components/common/button/button';
import presetStyle from '../../assets/styles/style';
import appActions from '../../redux/app/actions';
import SafeAreaView from '../../components/common/misc/safe.area.view';

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
  title: {
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonView: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
  name: {
    marginTop: 17,
  },
  notice: {
    marginTop: 5,
    fontSize: 12,
    color: '#DF5264',
    marginHorizontal: 5,
  },
});

class Rename extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        name: props.username,
      };
      this.onChangeText = this.onChangeText.bind(this);
      this.onSubmitEditing = this.onSubmitEditing.bind(this);
      this.onPress = this.onPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const {
        isUsernameUpdated, navigation, resetUsernameUpdated,
      } = nextProps;
      // If isWalletsUpdated, wallet is deleted.
      if (isUsernameUpdated && resetUsernameUpdated) {
        resetUsernameUpdated();
        navigation.goBack();
      }
    }

    onPress() {
      const { name } = this.state;
      const { rename } = this.props;
      rename(name);
      this.nameInput.focus();
    }

    onSubmitEditing() {
      const { name } = this.state;
      const submitText = name.trim();
      this.setState({ name: submitText });
    }

    onChangeText(text) {
      this.setState({ name: text });
    }

    render() {
      const { navigation } = this.props;
      const { name } = this.state;
      return (
        <SafeAreaView>
          <View style={[flex.flex1]}>
            <ScrollView style={[flex.flex1]}>
              <Header goBack={() => navigation.goBack()} title="Your Name" />
              <View style={[screenHelper.styles.body, { paddingHorizontal: 25 }]}>
                <Loc style={[styles.title]} text="What's your name?" />
                <TextInput
                  ref={(ref) => { this.nameInput = ref; }}
                  style={[presetStyle.textInput, styles.nameInput]}
                  value={name}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitEditing}
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <Loc style={[styles.notice]} text="* Name can contain 1-32 letters (a-z), numbers (0-9), and space" />
              </View>
            </ScrollView>
            <View style={styles.buttonView}>
              <Button text="SAVE" onPress={this.onPress} />
            </View>
          </View>
        </SafeAreaView>
      );
    }
}

Rename.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  rename: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}),
  isUsernameUpdated: PropTypes.bool.isRequired,
  resetUsernameUpdated: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

Rename.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  username: state.App.get('username'),
  isUsernameUpdated: state.App.get('isUsernameUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  rename: (name) => dispatch(appActions.rename(name)),
  resetUsernameUpdated: () => dispatch(appActions.resetUsernameUpdated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Rename);
