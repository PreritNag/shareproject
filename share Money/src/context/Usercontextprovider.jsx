import React, { createContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create the provider
const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export both the context and provider
export { UserContext, UserContextProvider };
