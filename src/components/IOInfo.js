import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
import unitList from './UnitList.json';

const IOInfo = () => {
  const [activeHeader, setActiveHeader] = useState(null);

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
      <div className="input-info">Input</div>
      <div className="output-info">Output</div>
    </div>
  );
};

export default IOInfo;