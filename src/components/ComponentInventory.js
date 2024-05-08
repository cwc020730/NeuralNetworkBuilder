import React, { useContext } from 'react';
import ScaleContext from './ScaleContext';

const ComponentInventory = () => {
  const scale = useContext(ScaleContext);
  
  const handleDragStart = (event) => {
    const radius = 50;
    const diameter = 1.6 * radius * 2 * scale;

    const dragImage = document.createElement('div');
    dragImage.style.width = `${diameter}px`;
    dragImage.style.height = `${diameter}px`;
    dragImage.style.backgroundColor = 'steelblue';
    dragImage.style.borderRadius = '50%';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    document.body.appendChild(dragImage);

    event.dataTransfer.setData("radius", `${radius}`);
    event.dataTransfer.setData("color", "steelblue");
    event.dataTransfer.setDragImage(dragImage, diameter / 2, diameter / 2);

    event.target.ondragend = () => {
      document.body.removeChild(dragImage);
    };
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


