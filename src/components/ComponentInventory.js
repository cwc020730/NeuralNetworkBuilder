import React, { useContext, useState } from 'react';
import ScaleContext from './ScaleContext';
import componentStyles from './ComponentStyles';

const ComponentInventory = ({ initialComponents = ['component1', 'component2'] }) => {
  const [componentIds, setComponentIds] = useState(initialComponents);
  const scale = useContext(ScaleContext);

  const handleDragStart = (event, componentId) => {
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
    event.dataTransfer.setDragImage(dragImage, adjustedWidth / 2, adjustedHeight / 2);

    event.dataTransfer.setData('componentId', componentId);

    let isDragImageRemoved = false;

    const removeDragImage = () => {
      if (!isDragImageRemoved && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
        isDragImageRemoved = true;
      }
    };

    event.target.addEventListener('dragend', removeDragImage, { once: true });
  };

  const showComponents = (ids) => {
    setComponentIds(ids);
  };

  return (
    <div className="component-inventory">
      {componentIds.map((componentId) => {
        const component = componentStyles[componentId];
        if (!component) return null;

        return (
          <div className="component-showcase-slot" key={componentId}>
            <div
              className="draggable-component"
              draggable
              onDragStart={(e) => handleDragStart(e, componentId)}
            >
              {component.label}
            </div>
            <div className='component-description'>{componentId}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ComponentInventory;

