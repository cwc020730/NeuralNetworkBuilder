import React, { useState } from 'react';
import ComponentInventory from './ComponentInventory';

const InventoryController = () => {
  const [searchResults, setSearchResults] = useState(['component1', 'component2']);

  const handleSearch = (query) => {
    const allComponents = ['component1', 'component2', 'component3'];
    const filteredComponents = allComponents.filter(id => id.includes(query));
    setSearchResults(filteredComponents);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Components"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ComponentInventory initialComponents={searchResults} />
    </div>
  );
};

export default InventoryController;