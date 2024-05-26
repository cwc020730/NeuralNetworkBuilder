
import React from "react";

const DataSelectionController = () => {

    const dataSelectionList = [
        {
            id: 1,
            name: 'Data Selection 1'
        },
        {
            id: 2,
            name: 'Data Selection 2'
        },
        {
            id: 3,
            name: 'Data Selection 3'
        },
        {
            id: 4,
            name: 'Data Selection 4'
        },
        {
            id: 5,
            name: 'Data Selection 5'
        },
        {
            id: 6,
            name: 'Data Selection 6'
        },
        {
            id: 7,
            name: 'Data Selection 7'
        },
        {
            id: 8,
            name: 'Data Selection 8'
        },
        {
            id: 9,
            name: 'Data Selection 9'
        },
        {
            id: 10,
            name: 'Data Selection 10'
        }
    ];

    return (
        <div className="data-selection-controller">
            <div className="data-selection-item-container">
                {dataSelectionList.map((dataSelection) => {
                    return (
                        <div key={dataSelection.id} className="data-selection-item">
                            {dataSelection.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DataSelectionController;