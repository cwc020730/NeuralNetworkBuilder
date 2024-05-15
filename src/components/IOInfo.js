import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
import unitList from './UnitList.json';

const IOInfo = () => {

    return (
        <div className="io-info">
            <div className="input-header">Input</div>
            <div className="output-header">Output</div>
            <div className="input-info">Input</div>
            <div className="output-info">Output</div>
        </div>
    );
}

export default IOInfo;