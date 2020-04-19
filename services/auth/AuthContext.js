import React from 'react';

export default React.createContext({
    auth: null,
    isAuthenticated: false,
    checkAuth: null,
    setAuthenticated: null
});