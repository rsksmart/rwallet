import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import presetStyle from '../../assets/styles/style';
import walletActions from '../../redux/wallet/actions';
import BasePageGereral from '../base/base.page.general';
import CONSTANTS from '../../common/constants';

const styles = StyleSheet.create({
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
  body: {
    marginHorizontal: 25,
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
      renameKey(this.key, name, walletManager);
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
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader={false}
          bottomBtnText="button.save"
          bottomBtnOnPress={this.onPress}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.mine.keyName.title" />}
        >
          <View style={styles.body}>
            <Loc style={[styles.title]} text="page.mine.keyName.question" />
            <Loc text="page.mine.keyName.notice" />
            <Loc style={[styles.title, styles.name]} text="page.mine.keyName.name" />
            <TextInput
              ref={(ref) => { this.nameInput = ref; }}
              style={[presetStyle.textInput, styles.nameInput]}
              value={name}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEditing}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              maxLength={CONSTANTS.KEYNAME_MAX_LENGTH}
            />
            <Loc style={[styles.notice]} text="page.mine.keyName.comment" />
          </View>
        </BasePageGereral>
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
