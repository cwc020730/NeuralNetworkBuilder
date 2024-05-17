import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
import unitList from './UnitList.json';

const IOInfo = () => {
    const [activeHeader, setActiveHeader] = useState('input');
  
    const handleHeaderClick = (header) => {
      setActiveHeader(header);
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
        <div className="io-info-display">
            <div className="io-occupied-flag unoccupied"></div>
            <div className="io-label">Value 1</div>
        </div>
      </div>
    );
  };
  
  export default IOInfo;