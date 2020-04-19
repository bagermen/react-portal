import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from "react-router-dom";
import { compose, bindActionCreators } from 'redux';
import { connect } from "react-redux";
import withAuth from "../../services/auth/withAuth";
import { clearUserData } from '../../actions/index';
import PropTypes from "prop-types";

class Logout extends Component {
  /* jshint ignore:start */
  static propTypes = {
    auth: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    clearUserData: PropTypes.func,
    setAuthenticated: PropTypes.func
  }
  /* jshint ignore:end */
  constructor(...props) {
    super(...props);
  }

  componentDidMount() {
    this.props.auth.logOut().then(() => {
      this.props.clearUserData();
      this.props.setAuthenticated(false);
    });
  }

  render() {
    /* jshint ignore:start */
    if (!this.props.isAuthenticated) {
      return (<Redirect to="/"/>);
    }
    /* jshint ignore:stop */
    return (null);
  }
}

function mapDispatchToProps(dispatch) {
  return {
      ...bindActionCreators({
        clearUserData
      }, dispatch)
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(null, mapDispatchToProps),
)(Logout);