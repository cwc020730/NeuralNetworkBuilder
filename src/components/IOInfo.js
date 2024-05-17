import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
const IOInfo = () => {
  const [activeHeader, setActiveHeader] = useState('input');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { selectedUnitId, triggerRender, setTriggerRender } = useContext(AppContext);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (selectedUnitId) {
      setSelectedUnit(idToUnitMap.get(selectedUnitId));
    } else {
      setSelectedUnit(null);
    }
  }, [selectedUnitId]);

  useEffect(() => {
    console.log('IOInfo triggerRender:', triggerRender);
    setForceUpdate(triggerRender);
    setTriggerRender(0);
  }, [triggerRender]);

  const handleHeaderClick = (header) => {
    setActiveHeader(header);
  };

  const generateInfoDisplay = (type) => {
    if (!selectedUnit) return <div className='io-info-display'></div>;

    return (
      <div className="io-info-display">
        {selectedUnit.connectionPoints.map((connectionPoint, index) => {
          const occupied = connectionPoint.occupied;
          const occupiedClass = occupied ? 'occupied' : 'unoccupied';
          const label = connectionPoint.label;
          if ((type === 'input' && connectionPoint.is_input) || (type === 'output' && connectionPoint.is_output)) {
            return (
              <>
                <div className={`io-occupied-flag ${occupiedClass}`}></div>
                <div className="io-label">{label}</div>
              </>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="io-info">
      <div
        className={`io-info-header ${activeHeader === 'input' ? 'active' : ''}`}
        onClick={() => handleHeaderClick('input')}
      >
        INPUT
      </div>
      <div
        className={`io-info-header ${activeHeader === 'output' ? 'active' : ''}`}
        onClick={() => handleHeaderClick('output')}
      >
        OUTPUT
      </div>
      {activeHeader === 'input' ? generateInfoDisplay('input') : generateInfoDisplay('output')}
    </div>
  );
};

export default IOInfo;
