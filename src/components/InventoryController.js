import React, { useState, useEffect } from 'react';
import UnitInventory from './UnitInventory';
import CategoryMenu from './CategoryMenu';
import unitList from './UnitList.json';

const InventoryController = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  const [categories, setCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unitKeys = Object.keys(unitList);
    setAllUnits(unitKeys);
    setSearchResults(unitKeys);
    buildCategoryStructure(unitList);
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

  const buildCategoryStructure = (units) => {
    const categoryStructure = {};
    Object.keys(units).forEach(key => {
      const unitCategories = units[key].category || [];
      let currentLevel = categoryStructure;
      unitCategories.forEach(cat => {
        if (!currentLevel[cat]) {
          currentLevel[cat] = { subcategories: {} };
        }
        currentLevel = currentLevel[cat].subcategories;
      });
    });
    setCategories(categoryStructure);
  };

  const handleCategorySelect = (category) => {
    const updatedSelectedCategories = new Set(selectedCategories);
    if (updatedSelectedCategories.has(category)) {
      updatedSelectedCategories.delete(category);
    } else {
      updatedSelectedCategories.add(category);
    }
    setSelectedCategories(updatedSelectedCategories);
    filterUnits(searchQuery, updatedSelectedCategories);
  };


  const filterUnits = (query, categories) => {
    const filteredUnits = allUnits.filter(id => {
      const matchesQuery = id.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !categories.size || Array.from(categories).some(category => unitList[id].category.includes(category));
      return matchesQuery && matchesCategory;
    });
    setSearchResults(filteredUnits);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="sidebar-menu">
        <div className="category-menu">
          <div className='category-dropdown-container'>
            <button onClick={toggleOpen} className="category-dropdown-toggle-button">
              ≡
            </button>
            <div className='category-dropdown-button-text'>FILTERS</div>
            <div className='category-dropdown-clearall-button'>x</div>
            {isOpen && (
              <CategoryMenu categories={categories} handleCategorySelect={handleCategorySelect} selectedCategories={selectedCategories} />
            )}
          </div>
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
        <UnitInventory components={searchResults} />
      </div>
    </>
  );
};

export default InventoryController;