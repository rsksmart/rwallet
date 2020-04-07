/* eslint no-console: 0 */
import {
  all, take, takeEvery, put, call, cancelled,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actions';
import ParseHelper from '../../common/parse';


function createSocketChannel(socket) {
  console.log('createSocketChannel');
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createSocketChannel.subscribeHandler.');
      return emitter({ type: actions.PRICE_SUBSCRIBED });
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
      return emitter({ type: actions.PRICE_OBJECT_UPDATED, data: object });
    };

    const errorHandler = (error) => {
      console.log('createSocketChannel.errorHandler', error);
      return emitter({ type: actions.PRICE_CHANNEL_ERROR, error });
    };

    console.log('socket: ', socket);

    socket.on('open', subscribeHandler);
    // socket.on('close', unsubscribeHandler);
    socket.on('update', updateHandler);
    socket.on('error', errorHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

export function* initPriceSocketRequest() {
  let socket;
  let socketChannel;
  console.log('initPriceSocketRequest');

  try {
    const priceObj = yield call(ParseHelper.fetchPrices);
    yield put({ type: actions.PRICE_OBJECT_UPDATED, data: priceObj });
  } catch (error) {
    console.log('initPriceSocketRequest.fetchPrices, error:', error);
  }

  try {
    socket = yield call(ParseHelper.subscribePrice);
    socketChannel = yield call(createSocketChannel, socket);

    while (true) {
      const payload = yield take(socketChannel);
      console.log('payload: ', payload);
      yield put(payload);
    }
  } catch (err) {
    console.log('socket error:', err);
  } finally {
    if (yield cancelled()) {
      socketChannel.close();
      socket.close();
    } else {
      console.log('WebSocket disconnected: Price');
    }
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_PRICE, initPriceSocketRequest),
  ]);
}
