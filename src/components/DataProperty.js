import React, { useContext } from "react";
import { AppContext } from "./AppContext";

const DataProperty = ({ data }) => {
    const { selectedUnitId, selectedDataName, unitData } = useContext(AppContext);

    // Helper function to render nested objects
    const renderObject = () => {
        if (unitData[selectedUnitId] && unitData[selectedUnitId][selectedDataName]) {
            const data = unitData[selectedUnitId][selectedDataName];
            return (
                <div className="data-property">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            );
        }
    };

    return (
        <div className="data-property">
            {unitData ? renderObject() : <p>No unit data available</p>}
        </div>
    );
};

export default DataProperty;
