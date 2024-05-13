import React, { useState, useEffect } from 'react';
import ComponentInventory from './ComponentInventory';
import unitList from './UnitList.json';

const InventoryController = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  useEffect(() => {
    const unitKeys = Object.keys(unitList);
    setAllUnits(unitKeys);
    setSearchResults(unitKeys);
  }, []);

  const handleSearch = (query) => {
    console.log('allUnits:', allUnits);
    console.log('query:', query);
    setSearchQuery(query);
    const filteredUnits = allUnits.filter(id =>
      id.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredUnits);
    console.log('filteredComponents:', filteredUnits);
  };

  return (
    <>
      <div className="sidebar-menu">
        <div className="category-menu">
            Category Menu
        </div>
        <div className='search-bar'>
          <div>
            <input
              className='search-bar-text-input'
              type="text"
              placeholder="Search Components"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="component-inventory">
        <ComponentInventory components={searchResults} />
      </div>
    </>
  );
};

export default InventoryController;