import { Map } from 'immutable';
import actions from './actions';
import common from '../../common/common';

const initState = new Map({
  prices: [],
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.PRICE_OBJECT_UPDATED:
    {
      let prices = action.data;
      prices = common.addPriceData(prices);
      console.log('PRICE_OBJECT_UPDATED, prices: ', prices);
      return state.set('prices', prices);
    }
    default:
      return state;
  }
}
