import React from 'react';
import AuthContext from './AuthContext';
import PropTypes from "prop-types";
import Auth from './Auth';
import ReduxStorageHelper from './ReduxStorageHelper';
import APIAction from '../APIAction';
import { api } from '../APIAction';

/**
 * Provides User Context
 */
export default class AuthContextProvider extends React.Component {
  /* jshint ignore:start */
  static propTypes = {
    store: PropTypes.object
  }
  /* jshint ignore:end */
  constructor(...props) {
    super(...props);

    const storage = this.initStorageHelper();

    this.state = {
      auth: this.initAuth(storage),
      isAuthenticated: storage.getAuthenticated(),
      checkAuth: () => {
        this.state.auth.getSession().then(({err, session}) => {
          const isAuthenticated = !!(!err && session && session.isValid());

          if (storage.getAuthenticated() != isAuthenticated ) {
            this.state.setAuthenticated(isAuthenticated);
          }
        });
      },
      setAuthenticated: authenticated => this.setState({isAuthenticated: storage.setAuthenticated(authenticated)})
    };
  }
  componentWillUnmount() {
    this.storageHelper = null;
  }

  initAuth(storage) {
    const auth = new Auth(storage);
    APIAction.setAuth(auth);
    api.setAuth(auth);

    return auth;
  }

  initStorageHelper() {
    return new ReduxStorageHelper(this.props.store, 'aws_user');
  }

  render() {
    /* jshint ignore:start */
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    )
    /* jshint ignore:end */
  }
}