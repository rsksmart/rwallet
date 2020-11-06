import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import color from '../../assets/styles/color';
import presetStyles from '../../assets/styles/style';
import Tags from './misc/tags';
import Loc from './misc/loc';
import { createErrorNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';
import fontFamily from '../../assets/styles/font.family';

const MNEMONIC_LENGTH = 12;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  walletName: {
    fontSize: 20,
  },
  sectionContainer: {
    marginTop: 10,
    paddingBottom: 10,
  },
  phrasesBorder: {
    minHeight: 120,
    paddingBottom: 10,
  },
  phraseView: {
    borderBottomColor: color.silver,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: color.component.input.backgroundColor,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
    borderStyle: 'solid',
  },
  phraseTitle: {
    marginBottom: 14,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 16,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

class MnemonicInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      mnemonic: '',
    };
  }

  onSubmitEditing = () => {
    const { mnemonic } = this.state;
    const trimText = mnemonic.trim();
    this.inputText(trimText);
  }

  onChangeText = (text) => {
    const char = text[text.length - 1];
    if (char !== ' ') {
      this.setState({ mnemonic: text });
      return;
    }
    const trimText = text.trim();
    this.inputText(trimText);
  }

  onTagsPress = (index) => {
    const { onWordsDeleted } = this.props;
    this.deleteWord(index);
    this.wordInput.focus();
    onWordsDeleted();
  }

  inputText = (text) => {
    const words = text.split(' ');
    words.forEach((word) => {
      const trimWord = word.trim();
      this.inputWord(trimWord);
    });
  }

  inputWord = (word) => {
    const { addNotification, onMnemonicInputted } = this.props;
    const { words } = this.state;
    if (word === '') {
      this.setState({ mnemonic: '' });
      return;
    }
    if (words.length === MNEMONIC_LENGTH) {
      const notification = createErrorNotification(
        'modal.tooManyPhrase.title',
        'modal.tooManyPhrase.body',
      );
      addNotification(notification);
      return;
    }

    words.push(word);
    if (words.length === MNEMONIC_LENGTH) {
      const mnemonic = _.reduce(words, (line, item, index) => line + (index === 0 ? item : ` ${item}`), '');
      onMnemonicInputted(mnemonic);
    }

    this.setState({ words, mnemonic: '' });
    this.wordInput.focus();
  }

  deleteWord = (index) => {
    const { words } = this.state;
    words.splice(index, 1);
    this.setState({ words });
  }

  reset = () => {
    this.setState({ words: [] });
  }

  render() {
    const { style } = this.props;
    const { mnemonic, words } = this.state;

    return (
      <View style={style}>
        <Loc style={styles.phraseTitle} text="page.wallet.recovery.note" />
        <View style={styles.phraseView}>
          <TextInput
            autoFocus // If true, focuses the input on componentDidMount. The default value is false.
                                      // This code uses a ref to store a reference to a DOM node
                                      // https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element
            ref={(ref) => {
              this.wordInput = ref;
            }}
                                      // set blurOnSubmit to false, to prevent keyboard flickering.
            blurOnSubmit={false}
            style={[presetStyles.textInput, styles.input]}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitEditing}
            value={mnemonic}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={[styles.phrasesBorder, { flexDirection: 'row' }]}>
            <Tags
              style={[{ flex: 1 }]}
              data={words}
              onPress={this.onTagsPress}
            />
          </View>
        </View>
      </View>
    );
  }
}

MnemonicInput.propTypes = {
  onMnemonicInputted: PropTypes.func,
  onWordsDeleted: PropTypes.func,
  addNotification: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

MnemonicInput.defaultProps = {
  onMnemonicInputted: () => null,
  onWordsDeleted: () => null,
  style: null,
};


const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(MnemonicInput);
