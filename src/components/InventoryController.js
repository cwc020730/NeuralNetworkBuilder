import React, { useState } from 'react';
import ComponentInventory from './ComponentInventory';

const InventoryController = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(['component1', 'component2', 'component3']);

  const handleSearch = (query) => {
    console.log('query:', query);
    setSearchQuery(query);
    const allComponents = ['component1', 'component2', 'component3'];
    const filteredComponents = allComponents.filter(id =>
      id.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredComponents);
    console.log('filteredComponents:', filteredComponents);
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