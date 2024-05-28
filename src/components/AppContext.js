import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [triggerRender, setTriggerRender] = useState(0);
  const [activeBottomArea, setActiveBottomArea] = useState('unit-info');

  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [triggerRefreshUnitData, setTriggerRefreshUnitData] = useState(0);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/unit_data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUnitData(data); // Store the fetched data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchData();
    setTriggerRefreshUnitData(0);
  }, [triggerRefreshUnitData]);

  return (
    <AppContext.Provider value={
      {
        scale,
        setScale,
        selectedUnitId,
        setSelectedUnitId,
        triggerRender,
        setTriggerRender,
        activeBottomArea,
        setActiveBottomArea,
        unitData,
        setUnitData,
        loading,
        setLoading,
        error,
        setError,
        triggerRefreshData: triggerRefreshUnitData,
        setTriggerRefreshData: setTriggerRefreshUnitData
      }
    }>
      {children}
    </AppContext.Provider>
  );
};
