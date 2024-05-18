import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';

const ParamControls = () => {
    const { selectedUnitId } = useContext(AppContext);
    
    const selectedUnit = idToUnitMap.get(selectedUnitId);
    const [unitParameters, setUnitParameters] = useState(new Map());

    useEffect(() => {
        if (selectedUnit) {
            setUnitParameters(new Map(Object.entries(selectedUnit.parameters)));
        }
    }, [selectedUnit]);

    const handleInputChange = (param, index, newValue) => {
        setUnitParameters(prevState => {
            const newParameters = new Map(prevState);
            const paramData = newParameters.get(param);
            if (Array.isArray(paramData.value)) {
                const newValueArray = [...paramData.value];
                newValueArray[index] = newValue;
                newParameters.set(param, { ...paramData, value: newValueArray });
            } else {
                newParameters.set(param, { ...paramData, value: newValue });
            }
            return newParameters;
        });
    };

    function constructModifiableParamValueJSX(param, value, type) {
        if (Array.isArray(value)) {
            return (
                <div className='param-value-list-container-grid'>
                    <div className='param-value-list-start'>[</div>
                    <div className='param-value-grid'>
                        {value.map((listItem, index) => (
                            <input 
                                key={index}
                                className='param-value' 
                                type='text' 
                                value={listItem} 
                                onChange={(e) => handleInputChange(param, index, e.target.value)} 
                            />
                        ))}
                    </div>
                    <div className='param-value-list-end'>]</div>
                </div>
            );
        } else {
            return (
                <input
                    className='param-value'
                    type='text'
                    value={value}
                    onChange={(e) => handleInputChange(param, 0, e.target.value)}
                />
            );
        }
    }
    
    function createParamKVPairAndControlsJSX(param, value, type) {
        const type_abbr = type.substring(0, 1).toUpperCase();
        return (
            <div className='param-info-triplet' key={param}>
                <div className='param-type'>{type_abbr}</div>
                <div className='param-name'>{param}:</div>
                {constructModifiableParamValueJSX(param, value, type)}
                <div className='param-apply-button'>APPLY</div>
            </div>
        );
    }

    function constructEntireParamJSX(parametersMap) {
        const paramJSX = [];
        for (const [param_name, param_attr] of parametersMap.entries()) {
            const { type, description, default_value, value } = param_attr;
            paramJSX.push(createParamKVPairAndControlsJSX(param_name, value, type));
        }
        return paramJSX;
    }

    return (
        <div className="param-controls">
            <div className='param-controls-header'>PARAMETERS</div>
            {selectedUnit ? constructEntireParamJSX(unitParameters) : ""}
        </div>
    );
}

export default ParamControls;
