import React from 'react';

const ComponentInventory = () => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("radius", "50");
    event.dataTransfer.setData("color", "steelblue");

    event.currentTarget.style.opacity = "0.5";
  };

  return (
    <div className="component-inventory">
      <div 
        className="draggable-item" 
        draggable 
        onDragStart={handleDragStart} 
        style={{ width: '100px', height: '100px', backgroundColor: 'steelblue', borderRadius: '50%', cursor: 'grab' }}>
      </div>
    </div>
  );
};

export default ComponentInventory;
