import React from "react";
import { Route, Redirect } from "react-router-dom";
import { compose } from 'redux';
import withAuth from "../services/auth/withAuth";
import PropTypes from "prop-types";

class RouteProtected extends Route {
  /* jshint ignore:start */
  static propTypes = {
    loginPath: PropTypes.string.isRequired
  };
  static defaultProps = {
    loginPath: '/login'
  }
  /* jshint ignore:end */

  constructor(...props) {
    super(...props);
  }


  render() {
    this.props.checkAuth();

    /* jshint ignore:start */
    return (
      <Route path={this.props.path} render={(...props) => {
        return (
          this.props.isAuthenticated
            ? this.props.render(...props)
            : <Redirect to={{ pathname: this.props.loginPath, state: { from: props.location } }}/>
          )
      }}/>
    )
    /* jshint ignore:end */
  }
}

export default compose(
  withAuth
)(RouteProtected);