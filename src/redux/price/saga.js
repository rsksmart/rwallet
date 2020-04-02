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
      // ParseHelper.unsubscribe(socket);
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

    const createHandler = (object) => {
      console.log('createSocketChannel.createHandler', object);
      return emitter({ type: actions.PRICE_OBJECT_UPDATED, data: object });
    };

    const enterHandler = (object) => {
      console.log('createSocketChannel.enterHandler', object);
      return emitter({ type: actions.PRICE_OBJECT_UPDATED, data: object });
    };

    const errorHandler = (error) => {
      console.log('createSocketChannel.errorHandler', error);
      return emitter({ type: actions.PRICE_CHANNEL_ERROR, error });
    };

    console.log('socket: ', socket);

    socket.on('open', subscribeHandler);
    socket.on('close', unsubscribeHandler);
    socket.on('update', updateHandler);
    socket.on('error', errorHandler);
    socket.on('enter', enterHandler);
    socket.on('create', createHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

export function* initSocketRequest() {
  let socket;
  let socketChannel;
  console.log('initSocketRequest');
  try {
    const collection = 'Global'; // The Parse Class containing price data

    socket = yield call(ParseHelper.subscribe, collection);
    socketChannel = yield call(createSocketChannel, socket);

    while (true) {
      const payload = yield take(socketChannel);
      console.log('payload: ', payload);
      yield put(payload);
    }
  } catch (err) {
    console.error('socket error:', err);
  } finally {
    if (yield cancelled()) {
      // close the channel
      console.log('close!!!!!!!!');
      socketChannel.close();
      socket.close();
    } else {
      console.error('WebSocket disconnected: Price');
    }
  }
}

export default function* topicSaga() {
  yield all([
    takeEvery(actions.INIT_SOCKET_PRICE, initSocketRequest),
  ]);
}
