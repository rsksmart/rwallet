import {
  all, take, takeEvery, put, call, cancelled, select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../common/parse';
import parseDataUtil from '../../common/parseDataUtil';
import reportErrorToServer from '../../common/error/report.error';

function createSocketChannel(socket) {
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createSocketChannel.subscribeHandler.');
      return emitter({ type: actions.FETCH_PRICE });
    };

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(socket);
      console.log('createSocketChannel.unsubscribeHandler. Price channel unsubscribeHandler is called.');

      return emitter({ type: actions.PRICE_UNSUBSCRIBED });
    };

    // There are 5 types of event available for Live Query
    // create, enter, update, leave, delete
    // Here we only care about data update so only specify updateHandler
    const updateHandler = (object) => {
      console.log('createSocketChannel.updateHandler', object);
      const prices = parseDataUtil.getPrices(object);
      return emitter({ type: actions.PRICE_OBJECT_UPDATED, data: prices });
    };

    const errorHandler = (error) => {
      console.log('createSocketChannel.errorHandler', error);
      return emitter({ type: actions.PRICE_CHANNEL_ERROR, error });
    };

    socket.on('open', subscribeHandler);
    socket.on('update', updateHandler);
    socket.on('error', errorHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

/**
 * Fetch prices of token sand update tokens
 */
function* fetchPricesRequest() {
  try {
    const prices = yield call(ParseHelper.fetchPrices);
    yield put({ type: actions.PRICE_OBJECT_UPDATED, data: prices });
  } catch (error) {
    console.log('initPriceSocketRequest.fetchPrices, error:', error);
    reportErrorToServer({
      developerComment: 'redux saga price: fetchPricesRequest',
      errorObject: error,
    });
  }
}

/**
 * Subscribe prices
 */
function* subscribePrices() {
  let socket;
  let socketChannel;
  try {
    const state = yield select();
    socket = yield call(ParseHelper.subscribePrice);
    socketChannel = yield call(createSocketChannel, socket);

    // When resubscribing we need to close the last channel
    const priceChannel = state.Price.get('priceChannel');
    if (priceChannel) {
      priceChannel.close();
    }
    yield put({ type: actions.SET_PRICE_CHANNEL, value: socketChannel });

    while (true) {
      const payload = yield take(socketChannel);
      yield put(payload);
    }
  } catch (err) {
    console.log('socket error:', err);
    reportErrorToServer({
      developerComment: 'redux saga price: subscribePrices',
      errorObject: err,
    });
  } finally {
    if (yield cancelled()) {
      socketChannel.close();
      socket.close();
    } else {
      console.log('WebSocket disconnected: Price');
    }
  }
}

/**
 * initialize LiveQuery for price
 * @param {array} tokens Array of Coin class instance
 */
function* initPriceSocketRequest() {
  yield call(subscribePrices);
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_PRICE, initPriceSocketRequest),
    takeEvery(actions.FETCH_PRICE, fetchPricesRequest),
  ]);
}
