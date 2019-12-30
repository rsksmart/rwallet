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
import walletActions from '../../redux/wallet/actions';

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

class KeyName extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        name: '',
      };
      this.onChangeText = this.onChangeText.bind(this);
      this.onSubmitEditing = this.onSubmitEditing.bind(this);
      this.onPress = this.onPress.bind(this);
    }

    componentWillMount() {
      const { navigation } = this.props;
      const { key } = navigation.state.params;
      this.key = key;
      this.setState({ name: key.name });
    }

    componentWillReceiveProps(nextProps) {
      const {
        isWalletNameUpdated, navigation, resetWalletNameUpdated,
      } = nextProps;
      // If isWalletsUpdated, wallet is deleted.
      if (isWalletNameUpdated && resetWalletNameUpdated) {
        resetWalletNameUpdated();
        navigation.goBack();
      }
    }

    onPress() {
      const { name } = this.state;
      const { renameKey, walletManager } = this.props;
      console.log(`Key name save! name: ${name}`);
      renameKey(this.key, name, walletManager);
      this.nameInput.focus();
    }

    onSubmitEditing() {
      console.log('onSubmitEditing');
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
        <View style={[flex.flex1]}>
          <ScrollView style={[flex.flex1]}>
            <Header goBack={() => navigation.goBack()} title="Key Name" />
            <View style={[screenHelper.styles.body, { paddingHorizontal: 25 }]}>
              <Loc style={[styles.title]} text="What do you call this key?" />
              <Loc text="You can change the name displayed on the device below" />
              <Loc style={[styles.title, styles.name]} text="Name" />
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
              <Loc style={[styles.notice]} text="* Key name can contain 1-32 letters (a-z), numbers (0-9), and space" />
            </View>
          </ScrollView>
          <View style={[styles.buttonView]}>
            <View style={styles.buttonView}>
              <Button text="SAVE" onPress={this.onPress} />
            </View>
          </View>
        </View>
      );
    }
}

KeyName.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  renameKey: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}),
  isWalletNameUpdated: PropTypes.bool.isRequired,
  resetWalletNameUpdated: PropTypes.func.isRequired,
};

KeyName.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  renameKey: (key, name, walletManager) => dispatch(walletActions.renameKey(key, name, walletManager)),
  resetWalletNameUpdated: () => dispatch(walletActions.resetWalletNameUpdated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(KeyName);
