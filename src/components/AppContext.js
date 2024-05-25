import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [triggerRender, setTriggerRender] = useState(0);
  const [activeBottomArea, setActiveBottomArea] = useState('unit-info');

  return (
    <AppContext.Provider value={{ scale, setScale, selectedUnitId, setSelectedUnitId, triggerRender, setTriggerRender, activeBottomArea, setActiveBottomArea }}>
      {children}
    </AppContext.Provider>
  );
};
