import React, { useContext } from 'react';
import ScaleContext from './ScaleContext';

const ComponentInventory = () => {
  const scale = useContext(ScaleContext);

  const handleDragStart = (event) => {
    const width = 160;
    const height = 60;
    const adjustedWidth = 1.6 * width * scale;
    const adjustedHeight = 1.6 * height * scale;
    const adjustedBorderRadius = 1.6 * 10 * scale;
    let dragImage; 

    dragImage = document.createElement('div');
    dragImage.style.width = `${adjustedWidth}px`;
    dragImage.style.height = `${adjustedHeight}px`;
    dragImage.style.backgroundColor = 'steelblue';
    dragImage.style.borderRadius = `${adjustedBorderRadius}px`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.opacity = '1';
    document.body.appendChild(dragImage);

    event.dataTransfer.setData('height', `${height}`);
    event.dataTransfer.setData('width', `${width}`);
    event.dataTransfer.setData('color', 'steelblue');
    event.dataTransfer.setDragImage(dragImage, adjustedWidth / 2, adjustedHeight / 2);

    let isDragImageRemoved = false;

    const removeDragImage = () => {
      if (!isDragImageRemoved && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
        isDragImageRemoved = true;
      }
    };

    event.target.addEventListener('dragend', removeDragImage, { once: true });
  };

  return (
    <div className="component-inventory">
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 1</div>
      </div>
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 2</div>
      </div>
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 3</div>
      </div>
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 4</div>
      </div>
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 5</div>
      </div>
      <div className='component-showcase-slot'>
        <div
          className="draggable-component"
          draggable
          onDragStart={handleDragStart}
        >
        </div>
        <div className="component-description">Item 6</div>
      </div>
    </div>
  );
};

export default ComponentInventory;

