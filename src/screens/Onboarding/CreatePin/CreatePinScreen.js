import React from 'react';
import { NavigationActions } from 'react-navigation';
import {
  Container,
  Content,
  Button,
  Icon,
} from 'native-base';
import { t } from 'mellowallet/src/i18n';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import InputPin from 'mellowallet/src/components/InputPin';
import RemovableView from 'mellowallet/src/components/RemovableView';

class CreatePinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      isPinCompleted: false,
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  }

  onPinChange = (pin) => {
    this.setState({ pin });
  }

  onPinFulFill = () => {
    this.setState({ isPinCompleted: true });
  }

  onCompletePress = () => {
    const { isPinCompleted, pin } = this.state;
    if (!isPinCompleted) {
      return;
    }
    const { navigation } = this.props;
    navigation.navigate('ConfirmPinScreen', { pin });
  }

  render() {
    const { pin, isPinCompleted } = this.state;
    return (
      <Container>
        <ActionHeader
          title={t('Create your PIN')}
          backAction={this.goBack}
        >
          <RemovableView hidden={!isPinCompleted}>
            <Button
              transparent
              onPress={this.onCompletePress}
            >
              <Icon name="check" />
            </Button>
          </RemovableView>
        </ActionHeader>
        <Content padder>
          <InputPin
            label={t('Type your 5 digits PIN')}
            value={pin}
            onFulfill={this.onPinFulFill}
            onTextChange={this.onPinChange}
          />
        </Content>

      </Container>
    );
  }
}

export default CreatePinScreen;
