import { React, useState } from 'react';

const CategoryItem = ({ category, subcategories, selectedCategories, handleCategorySelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
  
    return (
      <li className='category-dropdown-menu-list'>
        <div className={selectedCategories.has(category) ? "category-item-selected" : "category-item"}>
          <span onClick={() => handleCategorySelect(category)} onMouseOver={toggleOpen} className="category-name">{category}</span>
          <div onClick={() => handleCategorySelect(category)} onMouseOver={toggleOpen}>{">"}</div>
        </div>
        {isOpen && Object.keys(subcategories).length > 0 && (
          <div className="subcategory">
            <CategoryMenu 
              categories={subcategories}
              handleCategorySelect={handleCategorySelect}
              selectedCategories={selectedCategories}
            />
          </div>
        )}
      </li>
    );
};

const CategoryMenu = ({ categories, handleCategorySelect, selectedCategories }) => {
  return (
    <ul className='category-dropdown-menu'>
        {Object.keys(categories).map(category => (
            <CategoryItem
            key={category}
            category={category}
            subcategories={categories[category].subcategories}
            handleCategorySelect={handleCategorySelect}
            selectedCategories={selectedCategories}
            />
        ))}
    </ul>
  );
};


export default CategoryMenu;
