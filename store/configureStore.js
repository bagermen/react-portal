import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
// import loggerMiddleware from 'redux-logger';

import promiseMiddleware from '../middleware/promiseMiddleware';
import createRootReducer from '../reducers/index';
import persistState from 'redux-localstorage';

/**
 * Browser history object
 */
export const AppHistory = createBrowserHistory();
const compose = composeWithDevTools({});

/**
 * Creates a preconfigured store for this example.
 */
export default function configureStore(initialState) {
  // create reducer from outlets, custom reducers and our router
  const reducer = createRootReducer(AppHistory);
  const store =  createStore(reducer, initialState, compose(
    applyMiddleware(
      routerMiddleware(AppHistory),
      thunkMiddleware,
      promiseMiddleware
    ),
    persistState(
      [
        "aws_user",
        "user",
        "dashboard_filter"
      ],
      { key: "ca-portal" }
      )
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
	return store;
}