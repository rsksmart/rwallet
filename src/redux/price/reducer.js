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
      const priceObj = action.data;
      let prices = priceObj.get('value');
      prices = prices && common.addOrUpdateDOCPrice(prices);
      console.log('PRICE_OBJECT_UPDATED, prices: ', prices);
      return state.set('prices', prices);
    }
    default:
      return state;
  }
}
