import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  return (
    <AppContext.Provider value={{ scale, setScale, selectedUnitId, setSelectedUnitId }}>
      {children}
    </AppContext.Provider>
  );
};
