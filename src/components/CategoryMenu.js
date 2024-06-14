import { React, useState } from 'react';

const CategoryItem = ({ category, subcategories, selectedCategories, handleCategorySelect, expandedCategory, setExpandedCategory, parentMap }) => {

    const setOpen = () => {
      setExpandedCategory(category);
    }

    const isChild = (a, b) => {
      const visited = new Set();
      while (a !== b && b !== null) {
        if (visited.has(b)) {
          // Detected a cycle, break out of the loop
          break;
        }
        visited.add(b);
        b = parentMap[b];
      }
      return a === b;
    }
  
    return (
      <li className='category-dropdown-menu-list'>
        <div className={selectedCategories.has(category) ? "category-item-selected" : "category-item"}>
          <span onClick={() => handleCategorySelect(category)} onMouseEnter={setOpen} className="category-name">{category}</span>
          <div onClick={() => handleCategorySelect(category)} onMouseEnter={setOpen}>
            {Object.keys(subcategories).length == 0 ? "": ">"}
          </div>
        </div>
        {(expandedCategory === category || isChild(category, expandedCategory)) && Object.keys(subcategories).length > 0 && (
          <div className="subcategory">
            <CategoryMenu 
              categories={subcategories}
              handleCategorySelect={handleCategorySelect}
              selectedCategories={selectedCategories}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
              parentMap={parentMap}
            />
          </div>
        )}
      </li>
    );
};

const CategoryMenu = ({ categories, handleCategorySelect, selectedCategories, expandedCategory, setExpandedCategory, parentMap }) => {
  return (
    <ul className='category-dropdown-menu'>
        {Object.keys(categories).map(category => (
            <CategoryItem
              key={category}
              category={category}
              subcategories={categories[category].subcategories}
              handleCategorySelect={handleCategorySelect}
              selectedCategories={selectedCategories}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
              parentMap={parentMap}
            />
        ))}
    </ul>
  );
};


export default CategoryMenu;
