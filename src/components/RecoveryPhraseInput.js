import React, { PureComponent } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { PropTypes } from 'prop-types';
import {
  View,
  Input,
  Item,
} from 'native-base';
import { t } from 'mellowallet/src/i18n';
import RecoveryPhraseBox from './RecoveryPhraseBox';


const styles = StyleSheet.create({
  containerBox: {
    borderColor: 'blue',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 300,
  },
  itemWithoutBorder: {
    borderColor: 'transparent',
  },
});

class RecoveryPhraseInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputAvailable: true,
      wordInput: '',
    };
  }

  componentDidUpdate() {
    const { wordsList, limitSize } = this.props;
    if (wordsList.length === limitSize) {
      this.onFullFillWordsList();
    }
  }

  onRemovePress = (key) => {
    const { onRemoveElement } = this.props;
    this.setState({ inputAvailable: true });
    onRemoveElement(key);
  };

  onFullFillWordsList = () => {
    Keyboard.dismiss();
    this.setState({ inputAvailable: false });
  };

  addWordToList = (wordInput) => {
    const { onAddElement } = this.props;
    this.setState({ wordInput: '' });
    onAddElement(wordInput);
  }

  onSubmitEditingHandler = () => {
    const { wordInput } = this.state;
    this.addWordToList(wordInput);
  }

  onChangeTextHandler = (wordInput) => {
    if (wordInput.endsWith(' ') && wordInput.trim().length > 0) {
      this.addWordToList(wordInput.trim());
      return;
    }
    this.setState({ wordInput });
  };

  render() {
    const { wordInput, inputAvailable } = this.state;
    const { wordsList } = this.props;
    return (
      <View style={styles.containerBox}>

        <Item style={styles.itemWithoutBorder}>
          <Input
            placeholder={t('Enter a word')}
            onChangeText={this.onChangeTextHandler}
            onSubmitEditing={this.onSubmitEditingHandler}
            blurOnSubmit={false}
            value={wordInput}
            editable={inputAvailable}
            returnKeyType="done"
          />
        </Item>

        <RecoveryPhraseBox
          dataSource={wordsList}
          onRemovePress={this.onRemovePress}
        />

      </View>
    );
  }
}

RecoveryPhraseInput.propTypes = {
  onAddElement: PropTypes.func.isRequired,
  onRemoveElement: PropTypes.func.isRequired,
  limitSize: PropTypes.number,
  wordsList: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    value: PropTypes.string,
  })),
};

RecoveryPhraseInput.defaultProps = {
  limitSize: 12,
  wordsList: [],
};

export default RecoveryPhraseInput;
