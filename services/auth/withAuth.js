import React from 'react';
import AuthContext from './AuthContext';
import PropTypes from "prop-types";
/**
 * Provides props:
 * cogintoUser: CognitoUser|null
 * setCognitoUser: function
 */
export default WrappedComponent => {
  const WithUser = parentProps => (
    /* jshint ignore:start */
    <AuthContext.Consumer>
      {({ ...props }) => {
        return (
          <WrappedComponent {...props} {...parentProps} />
        )
      }}
    </AuthContext.Consumer>
    /* jshint ignore:end */
  );

  WithUser.propTypes = {
    WrappedComponent: PropTypes.element,
  };
  WithUser.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithUser;
};