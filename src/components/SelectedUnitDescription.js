import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
import UnitList from './UnitList.json';

const SelectedUnitDescription = () => {
    const { selectedUnitId } = useContext(AppContext);

    if (!selectedUnitId) {
        return (
            <div className="selected-unit-description">
                <div>Select A Unit</div>
            </div>
        );
    }

    const selectedUnit = idToUnitMap.get(selectedUnitId);
    const unitTypeInfo = UnitList[selectedUnit.type];

    return (
        <div className="selected-unit-description">
            <div className='selected-unit-bold-label'>{unitTypeInfo.in_unit_label}</div>
            <div className='selected-unit-category'>{unitTypeInfo.category}</div>
            <div className='unit-description'>
                <div className='unit-uuid'>UUID: {selectedUnitId}</div>
                <div className='unit-description-text'>{unitTypeInfo.description}</div>
            </div>
        </div>
    );
}

export default SelectedUnitDescription;