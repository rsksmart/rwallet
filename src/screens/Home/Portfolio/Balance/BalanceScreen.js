import React, { Component } from 'react';
import Chart from 'mellowallet/src/components/Portfolio/Chart';
import { connect } from 'react-redux';
import {
  Content,
  Container,
} from 'native-base';
import { PropTypes } from 'prop-types';
import Wallet from 'mellowallet/src/store/models';
import WarningCard from 'mellowallet/src/components/WarningCard';
import Application from 'mellowallet/lib/Application';
import { printError } from 'mellowallet/src/utils';
import Loader from 'mellowallet/src/components/Loader';
import { refreshWalletsList } from 'mellowallet/src/store/actions/wallet';
import { setPortfolioRefresh } from 'mellowallet/src/store/actions/portfolio';
import { t } from 'mellowallet/src/i18n';
import NetworkList from './NetworkList';

const mapStateToProps = (state) => {
  const { rootReducer, portfolioReducer } = state;
  return {
    wallets: rootReducer.wallets,
    refreshPortfolio: portfolioReducer.refreshPortfolio,
  };
};

const mapDispatchToProps = dispatch => ({
  refreshWalletsList: wallets => dispatch(refreshWalletsList(wallets)),
  setPortfolioRefresh: value => dispatch(setPortfolioRefresh(value)),
});


class BalanceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: undefined,
      cardsData: undefined,
      portfolioTotal: undefined,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getPortfolioData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshPortfolio
      && (this.props.refreshPortfolio !== prevProps.refreshPortfolio)
      && !this.state.isLoading) {
      this.getPortfolioData();
      this.props.setPortfolioRefresh(false);
    }

    if (this.props.wallets !== prevProps.wallets) {
      this.getPortfolioData();
    }
  }

  getPortfolioData = () => {
    this.setState({ isLoading: true });
    Application(app => app.get_portfolio()
      .then(portfolio => this.getCotizations(portfolio))
      .catch(e => printError(e)));
  };

  getCotizations = (portfolio) => {
    const networksList = portfolio.currencies.map(network => (network.currency));
    const cotizationsPromises = networksList.map(
      networkName => this.getNetwrokCotization(networkName),
    );

    Promise.all(cotizationsPromises)
      .then(cotizations => this.updatePortfolioInfo(cotizations, portfolio));
  };

  getNetwrokCotization = network => (
    Application(app => app.currency_conversion(1, network, 'USD'))
      .then(cotization => ({ [network]: cotization }))
      .catch((e) => {
        printError(e);
        return 0;
      }));

  updatePortfolioInfo = (cotizations, portfolio) => {
    const { wallets } = this.props;
    if (wallets.length === 0) {
      this.setState({ isLoading: false });
      return;
    }

    const currenciesInfo = portfolio.currencies.map(network => ({
      currency: network.currency,
      balance: network.balance,
      change: network.change,
      cotization: cotizations
        .find(item => Object.keys(item)[0] === network.currency)[network.currency] || 0,
    }));

    const totalBalanceUnit = wallets[0].balance.fiat_unit;
    const networksValues = this.sumatoryWalletByNetwork(wallets);

    const graphData = this.buildGraphData(networksValues);
    const cardsData = this.buildCardsData(networksValues, currenciesInfo, totalBalanceUnit);

    this.setState({
      graphData,
      cardsData,
      portfolioTotal: portfolio.total,
      isLoading: false,
    });
  }

  buildGraphData = (networksValues) => {
    const currencies = Object.entries(networksValues).reduce((data, item) => (
      { ...data, [item[0]]: item[1].fiatValue }
    ), {});
    return currencies;
  };

  buildCardsData = (networksValues, currenciesInfo, totalBalanceUnit) => {
    const networksData = Object.keys(networksValues).map((id) => {
      const currencyInfo = currenciesInfo.find(portfolioItem => portfolioItem.currency === id);
      return {
        id,
        totalBalance: networksValues[id].fiatValue,
        totalBalanceUnit,
        totalCrypto: networksValues[id].value,
        cryptoCotization: currencyInfo ? parseFloat(currencyInfo.cotization) : 0,
        variation: currencyInfo ? currencyInfo.change : 0,
      };
    });
    return networksData;
  };

  sumatoryWalletByNetwork = (wallets) => {
    const valuesByNetwork = wallets.reduce((data, wallet) => {
      const previousValue = parseFloat(data[wallet.network]) || { fiatValue: 0, value: 0 };
      return {
        ...data,
        [wallet.network]: {
          fiatValue: previousValue.fiatValue + parseFloat(wallet.balance.fiat_value),
          value: previousValue.value + parseFloat(wallet.balance.value),
        },
      };
    }, {});
    return valuesByNetwork;
  };

  render() {
    const {
      graphData,
      cardsData,
      portfolioTotal,
      isLoading,
    } = this.state;

    if (!graphData || !cardsData || !portfolioTotal) {
      return (
        <Container>
          <Content>
            <Loader loading={isLoading} />
            <WarningCard
              color="#17EAD9"
              iconName="error-outline"
              message={t("You don't have any Mellow wallet yet. Let's create the first one!")}
            />
          </Content>
        </Container>
      );
    }

    return (
      <Container>
        <Content>
          <Loader loading={isLoading} />
          <Chart
            data={graphData}
            portfolioTotal={portfolioTotal}
          />

          <NetworkList
            networks={cardsData}
            isLoading={isLoading}
          />
        </Content>
      </Container>
    );
  }
}

BalanceScreen.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.shape(Wallet)),
  setPortfolioRefresh: PropTypes.func.isRequired,
  refreshWalletsList: PropTypes.func.isRequired,
  refreshPortfolio: PropTypes.bool.isRequired,
};

BalanceScreen.defaultProps = {
  wallets: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceScreen);
