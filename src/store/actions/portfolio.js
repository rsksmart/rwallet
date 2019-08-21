import {
  PORTFOLIO_BALANCE_CHANGED,
  REFRESH_PORTFOLIO,
} from '.';

export const onPortfolioBalanceChange = showBalance => ({
  type: PORTFOLIO_BALANCE_CHANGED,
  payload: showBalance,
});
export const setPortfolioRefresh = setRefreshPortfolio => ({
  type: REFRESH_PORTFOLIO,
  payload: setRefreshPortfolio,
});
