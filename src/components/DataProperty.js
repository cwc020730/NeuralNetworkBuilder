
import { React, useContext } from "react";
import { AppContext } from "./AppContext";

const DataProperty = ({ data }) => {

    const { selectedDataName } = useContext(AppContext);

    return (
        <div className="data-property">
            <div className="data-property-title">{selectedDataName}</div>
            <div className="data-property-value">{data}</div>
        </div>
    );
}

export default DataProperty;