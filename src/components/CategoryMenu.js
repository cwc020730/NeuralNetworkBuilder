import { React, useState } from 'react';

const CategoryItem = ({ category, subcategories, handleCategorySelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);
  
    return (
      <li>
        <div className="category-item">
          <span onClick={toggleOpen} className="category-name">{category}</span>
          <button onClick={() => handleCategorySelect(category)} className="filter-button">Filter</button>
        </div>
        {isOpen && Object.keys(subcategories).length > 0 && (
          <div className="subcategory">
            <CategoryMenu categories={subcategories} handleCategorySelect={handleCategorySelect} />
          </div>
        )}
      </li>
    );
};

const CategoryMenu = ({ categories, handleCategorySelect }) => {
  return (
    <ul className='category-dropdown-menu'>
        {Object.keys(categories).map(category => (
            <CategoryItem
            key={category}
            category={category}
            subcategories={categories[category].subcategories}
            handleCategorySelect={handleCategorySelect}
            />
        ))}
    </ul>
  );
};


export default CategoryMenu;
