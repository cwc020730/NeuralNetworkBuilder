import React, { useContext, useState, useEffect } from 'react';
import ScaleContext from './ScaleContext';
import unitList from './UnitList.json';

const UnitInventory = ({ components: units }) => {
  const [unitIds, setUnitIds] = useState(units);
  const scale = useContext(ScaleContext);

  useEffect(() => {
    setUnitIds(units);
  }, [units]);

  const handleDragStart = (event, unitId) => {
    const width = 160;
    const height = 60;
    const adjustedWidth = 1.6 * width * scale;
    const adjustedHeight = 1.6 * height * scale;
    const adjustedBorderRadius = 1.6 * 10 * scale;

    const [color, image] = [unitList[unitId]["color"], unitList[unitId]["image"]];

    let dragImage;

    dragImage = document.createElement('div');
    dragImage.style.width = `${adjustedWidth}px`;
    dragImage.style.height = `${adjustedHeight}px`;
    dragImage.style.backgroundColor = color;
    dragImage.style.borderRadius = `${adjustedBorderRadius}px`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.opacity = '1';
    document.body.appendChild(dragImage);

    const img = document.createElement('img');
    img.src = image;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = `${adjustedBorderRadius}px`;
    img.style.objectFit = 'cover';

    dragImage.appendChild(img);

    event.dataTransfer.setData('height', `${height}`);
    event.dataTransfer.setData('width', `${width}`);
    event.dataTransfer.setDragImage(dragImage, adjustedWidth / 2, adjustedHeight / 2);

    event.dataTransfer.setData('unitId', unitId);

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
    <div className="unit-inventory">
      {unitIds.map((unitId) => {
        const unit = unitList[unitId];
        if (!unit) return null;

        return (
          <div className="unit-showcase-slot" key={unitId}>
            <div
              className="draggable-unit"
              draggable
              onDragStart={(e) => handleDragStart(e, unitId)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '160px',
                height: '60px',
                backgroundColor: unit.color,
                borderRadius: '10px',
                cursor: 'grab',
                userSelect: 'none',
                backgroundImage: `url(${unit.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
            </div>
            <div className='unit-description'>{unitId}</div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitInventory;

