import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
  List,
  ListItem,
  Right,
  Body,
  Switch,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import {
  AsyncStorage,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import { t } from 'mellowallet/src/i18n';
import Loader from 'mellowallet/src/components/Loader';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import { printError } from 'mellowallet/src/utils';
import { connect } from 'react-redux';
import { onPortfolioBalanceChange } from 'mellowallet/src/store/actions/portfolio';
import { PropTypes } from 'prop-types';
import material from 'mellowallet/native-base-theme/variables/material';


const styles = StyleSheet.create({
  description: {
    padding: 19,
    paddingBottom: 25,
  },
});

const trackColor = { true: '#bf9df6' };

const mapDispatchToProps = dispatch => ({
  onPortfolioBalanceChange: showTotal => dispatch(onPortfolioBalanceChange(showTotal)),
});

const mapStateToProps = (state) => {
  const { portfolioReducer } = state;
  return {
    showBalanceUpdated: portfolioReducer.showBalanceUpdated,
  };
};


class PortfolioBalanceScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      portfolioBalance: true,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
    this.loadAsyncData();
  }

  componentWillReceiveProps() {
    this.loadAsyncData();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  loadAsyncData = async () => {
    await this.setState({ isLoading: true });
    AsyncStorage.getItem(AsyncStorageEnum.PORTFOLIO_BALANCE)
      .then((portfolioBalanceStorage) => {
        this.setState({
          isLoading: false,
          portfolioBalance: portfolioBalanceStorage === 'true',
        });
      })
      .catch(error => printError(error));
  }

  switchPortfolioBalance = (value) => {
    this.props.onPortfolioBalanceChange(value.toString());
  }

  goBack = () => this.props.navigation.goBack()

  render() {
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Portfolio Balance')}
        />

        <Content>
          <Loader loading={this.state.isLoading} />
          <View style={styles.description}>
            <Text>{t('You can show or hide the total balance in your porfolio')}</Text>
          </View>

          <List>

            <ListItem>
              <Body>
                <Text>{t('Show in Homescreen')}</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.portfolioBalance}
                  onValueChange={this.switchPortfolioBalance}
                  thumbColor={material.brandPrimary}
                  trackColor={trackColor}
                />
              </Right>
            </ListItem>

          </List>

        </Content>
      </Container>
    );
  }
}

PortfolioBalanceScreen.propTypes = {
  onPortfolioBalanceChange: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioBalanceScreen);
