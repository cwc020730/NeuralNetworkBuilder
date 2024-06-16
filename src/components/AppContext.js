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

  const [imageDataMap, setImageDataMap] = useState(new Map());

  const [backendError, setBackendError] = useState(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {

    // Set up WebSocket connection
    const newSocket = io('http://localhost:5000');

    newSocket.on('data_updated', (message) => {
      // Extract the unitId and unitData from message.data
      const [unitId, unitData] = Object.entries(message.data)[0];
  
      // Update state with the new data
      setUnitData((prevUnitData) => {
          if (prevUnitData) {
              // Create a new object with the existing data
              const newUnitData = { ...prevUnitData };
  
              // Update the specific unit id entry with the new data
              newUnitData[unitId] = unitData;
  
              return newUnitData;
          } else {
              // Replace unitData with the new data
              return { [unitId]: unitData };
          }
      });
  
      console.log('Data updated:', message.data);
    });

    newSocket.on('backend_error', (backend_error) => {
      setBackendError(
        {
          "header": backend_error.header,
          "error": backend_error.message
        }
      );
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connection established');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    setSocket(newSocket);

    // Clean up WebSocket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

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
        imageDataMap,
        setImageDataMap,
        backendError,
        setBackendError
      }
    }>
      {children}
    </AppContext.Provider>
  );
};
