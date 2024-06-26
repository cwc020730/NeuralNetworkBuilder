import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { idToUnitMap } from './D3Canvas';
import UnitList from './UnitList.json';

const SelectedUnitDescription = () => {
    const { selectedUnitId } = useContext(AppContext);

    if (!selectedUnitId) {
        return (
            <div className="selected-unit-description">
                <div className='selected-unit-bold-label'>SELECT A UNIT</div>
                <div className='selected-unit-category'>N/A</div>
                <div className='selected-unit-description-text-container'>
                    <div className='selected-unit-uuid'>UUID: N/A</div>
                    <div className='selected-unit-description-text'></div>
                </div>
            </div>
        );
    }

    const selectedUnit = idToUnitMap.get(selectedUnitId);
    const unitTypeInfo = UnitList[selectedUnit.type];

    const getCategoryString = (category) => {
        let categoryString = '';
        for (let i = 0; i < category.length; i++) {
            categoryString += category[i];
            if (i < category.length - 1) {
                categoryString += ' -> ';
            }
        }
        return categoryString;
    }

    return (
        <div className="selected-unit-description">
            <div className='selected-unit-bold-label'>{unitTypeInfo.in_unit_label}</div>
            <div className='selected-unit-category'>{getCategoryString(unitTypeInfo.category)}</div>
            <div className='selected-unit-description-text-container'>
                <div className='selected-unit-uuid'>UUID: {selectedUnitId}</div>
                <div className='selected-unit-description-text'>{unitTypeInfo.description}</div>
            </div>
        </div>
    );
}

export default SelectedUnitDescription;