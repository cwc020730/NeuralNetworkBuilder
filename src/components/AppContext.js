import React, { createContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [triggerRender, setTriggerRender] = useState(0);
  const [activeBottomArea, setActiveBottomArea] = useState('unit-info');
  const [selectedDataName, setSelectedDataName] = useState(null);

  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();

    // Set up WebSocket connection
    const socket = io('http://localhost:5000');

    socket.on('data_updated', (message) => {
      // Update state with the new data
      console.log('Data updated:', message.data)
      setUnitData(message.data);
    });

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [fetchData]);

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
        selectedDataName,
        setSelectedDataName,
      }
    }>
      {children}
    </AppContext.Provider>
  );
};
