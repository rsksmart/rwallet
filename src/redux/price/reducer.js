import { Map } from 'immutable';
import actions from './actions';
import common from '../../common/common';
import storage from '../../common/storage';

const initState = new Map({
  prices: [],
  priceChannel: undefined,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.PRICE_OBJECT_UPDATED:
    {
      let prices = action.data;
      prices = common.addPriceData(prices);
      console.log('PRICE_OBJECT_UPDATED, prices: ', prices);
      storage.setPrices(prices);
      return state.set('prices', prices);
    }
    case actions.SET_PRICE_CHANNEL: {
      return state.set('priceChannel', action.value);
    }
    default:
      return state;
  }
}
