
import { React, useState, useContext, useEffect } from "react";
import UnitList from "./UnitList";
import { AppContext } from "./AppContext";
import { idToUnitMap } from "./D3Canvas";

const DataSelectionController = () => {

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const { selectedUnitId, setSelectedDataName } = useContext(AppContext); 

    // for each output_label in the selected unit, create a data selection item
    useEffect(() => {
        setSelectedDataName(null);
        setSelectedId(null);
        if (selectedUnitId) {
          setSelectedUnit(idToUnitMap.get(selectedUnitId));
        } else {
          setSelectedUnit(null);
        }
    }, [selectedUnitId]);
    const selectedUnitInfo = selectedUnit ? UnitList[selectedUnit.type] : null;
    const dataSelectionList = [];
    if (selectedUnitInfo) {
        let i = 0;
        if (selectedUnitInfo["internal_parameters"]) {
            for (i = 0; i < selectedUnitInfo["internal_parameters"].length; i++) {
                dataSelectionList.push({
                    id: i,
                    name: selectedUnitInfo["internal_parameters"][i]
                });
            }
        }
        for (let j = 0; j < selectedUnitInfo["output"]["output_labels"].length; j++) {
            // filter names that starts with *
            if (selectedUnitInfo["output"]["output_labels"][j].startsWith('*')) {
                continue;
            }
            dataSelectionList.push({
                id: i,
                name: selectedUnitInfo["output"]["output_labels"][j]
            });
            i++;
        }
        
    }

    const handleItemClick = (id) => {
        setSelectedId(id);
        setSelectedDataName(dataSelectionList[id].name);
    };

    return (
        <div className="data-selection-controller">
            <div className="data-selection-item-container">
                {dataSelectionList.map((dataSelection) => {
                    return (
                        <div
                            key={dataSelection.id}
                            className={`data-selection-item ${selectedId === dataSelection.id ? 'selected' : ''}`}
                            onClick={() => handleItemClick(dataSelection.id)}
                        >
                            {dataSelection.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DataSelectionController;