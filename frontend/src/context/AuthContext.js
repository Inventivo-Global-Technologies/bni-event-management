import React from 'react';

const AuthContext = React.createContext({
  admin: null,
  handleAdminLogin: () => {},
  handleAdminLogout: () => {},
});

export default AuthContext;
