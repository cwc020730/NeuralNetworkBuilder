import React, { useContext } from "react";
import { AppContext } from "./AppContext";

const DataProperty = ({ data }) => {
    const { selectedDataName, unitData } = useContext(AppContext);

    // Helper function to render nested objects
    const renderObject = (obj, level = 0) => {
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} style={{ marginLeft: `${level * 20}px` }}>
                        <strong>{key}:</strong>
                        {renderObject(value, level + 1)}
                    </div>
                );
            } else {
                return (
                    <div key={key} style={{ marginLeft: `${level * 20}px` }}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                    </div>
                );
            }
        });
    };

    return (
        <div className="data-property">
            {unitData ? renderObject(unitData) : <p>No unit data available</p>}
        </div>
    );
};

export default DataProperty;
