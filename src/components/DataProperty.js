import React, { useState, useContext } from "react";
import { AppContext } from "./AppContext";

const DataProperty = () => {
    const { selectedUnitId, selectedDataName, unitData } = useContext(AppContext);
    const [expandedKeys, setExpandedKeys] = useState({});

    const toggleExpand = (key) => {
        setExpandedKeys((prevExpandedKeys) => ({
            ...prevExpandedKeys,
            [key]: !prevExpandedKeys[key],
        }));
    };

    const renderData = () => {
        const data = unitData[selectedUnitId][selectedDataName];
        return (
            <>
                {Object.keys(data).map((key) => {
                    const value = data[key];
                    const jsonValue = JSON.stringify(value, null, 2);
                    const isExpanded = expandedKeys[key];
                    const isLong = jsonValue.length > 30;

                    let sizestr = "";
                    if (key === "value" && isLong && Array.isArray(value) && data["shape"]) {
                        let size = 1;
                        data["shape"].forEach((dim) => {
                            size *= dim;
                        });
                        sizestr = ` (${size} elements)`;
                    }

                    return (
                        <div className="data-property-kv-pair" key={key}>
                            <div className="data-property-kv-pair-k">
                                {key}:&nbsp;
                            </div>
                            <div className="data-property-kv-pair-v">
                                {isLong ? (
                                    isExpanded ? (
                                        <>
                                            <button 
                                                className='data-property-kv-pair-v-btn-collapse' 
                                                onClick={() => toggleExpand(key)}>
                                            </button>
                                            <pre>{jsonValue}</pre>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className='data-property-kv-pair-v-btn-expand' 
                                                onClick={() => toggleExpand(key)}>
                                                {sizestr}
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <>{jsonValue}</>
                                )}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className="data-property-container">
            <div className="data-property-title">
                PROPERTIES
            </div>
            <div className="data-property">
                {unitData && unitData[selectedUnitId] && unitData[selectedUnitId][selectedDataName] ? (
                    renderData()
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default DataProperty;
