/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree. 
 * 
 * @providesModule reducers
 */


import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// Outlet reducers

// import ReduxOutlet from '../outlets/ReduxOutlet';
import LocalReduxOutlet from '../outlets/LocalReduxOutlet';

// custom reducers

import user from './user';
import page from './page';
import aws_user from './aws_user';
import avatar_editor from './avatar_editor';
import popup_alert from './popup_alert';
import state from './state';
import dashboard_filter from './dashboard/filter';
import dashboard from './dashboard/index';

// initial demo app state

import initialState from './initialState';

// outlets

const boards = LocalReduxOutlet('board').makeReducer(initialState.boards);
const pins = LocalReduxOutlet('pin').makeReducer(initialState.pins);
const notes = LocalReduxOutlet('note').makeReducer(initialState.notes);
const messages = LocalReduxOutlet('messages').makeReducer(initialState.messages);
const emails = LocalReduxOutlet('emails').makeReducer(initialState.emails);

export default (history) => combineReducers({
  router: connectRouter(history),
  page,
  boards,
  pins,
  notes,
  messages,
  emails,
  user,
  aws_user,
  avatar_editor,
  popup_alert,
  state,
  dashboard_filter,
  dashboard
 });