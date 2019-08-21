import React, { Component } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Icon,
  Button,
} from 'native-base';
import { t } from 'mellowallet/src/i18n';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { setPortfolioRefresh } from 'mellowallet/src/store/actions/portfolio';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import BalanceScreen from './Balance/BalanceScreen';
import NewsScreen from './News/NewsScreen';


const mapDispatchToProps = dispatch => ({
  setPortfolioRefresh: value => dispatch(setPortfolioRefresh(value)),
});

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    walletsListDirty: rootReducer.walletsListDirty,
  };
};

class PortfolioScreen extends Component {
  componentWillReceiveProps(props) {
    const { walletsListDirty } = props;
    if (walletsListDirty) {
      this.refreshSections();
    }
  }

  refreshSections = () => this.props.setPortfolioRefresh(true);

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>

        <ActionHeader
          title={t('Mellow')}
        >
          <Button
            transparent
            onPress={this.refreshSections}
          >
            <Icon name="refresh" type="MaterialCommunityIcons" />
          </Button>
        </ActionHeader>

        <Tabs>
          <Tab heading={t('Balance').toUpperCase()}>
            <BalanceScreen />
          </Tab>
          <Tab heading={t('News').toUpperCase()}>
            <NewsScreen />
          </Tab>
        </Tabs>

      </Container>
    );
  }
}

PortfolioScreen.propTypes = {
  setPortfolioRefresh: PropTypes.func.isRequired,
  walletsListDirty: PropTypes.bool,
};

PortfolioScreen.defaultProps = {
  walletsListDirty: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioScreen);
