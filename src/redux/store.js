import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerReducer } from 'react-router-redux';
import reducers from './reducers';
import rootSaga from './sagas';
import config from '../../config';

const { development: { reduxLoggerEnabled } } = config;

// Define all middle wares
const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();
const middlewares = [thunkMiddleware, sagaMiddleware];

// Middlewares for development controlled by config.js
if (reduxLoggerEnabled) {
  middlewares.push(loggerMiddleware);
}

// Create Store object
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  compose(applyMiddleware(...middlewares)),
);

// Start Saga middle ware
sagaMiddleware.run(rootSaga);

export default store;
