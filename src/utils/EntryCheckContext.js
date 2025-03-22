
import React, { createContext, useState, useContext } from 'react';

const LoggedInContext = createContext();

export const SellerProvider = ({ children }) => {
  const [loggedInby, setloggedInby] = useState('Coach');

  return (
    <LoggedInContext.Provider value={{ loggedInby, setloggedInby }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoginCheck = () => {
  return useContext(LoggedInContext);
};
