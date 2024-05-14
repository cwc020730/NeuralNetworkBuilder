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
    const adjustedFontSize = 1.6 * 16 * scale; // Adjust font size based on scale

    const [color, image] = [unitList[unitId]["color"], unitList[unitId]["image"]];
    const inUnitLabel = unitList[unitId]["in_unit_label"];
    const inUnitLabelColor = unitList[unitId]["in_unit_label_color"];

    let dragImage;

    dragImage = document.createElement('div');
    dragImage.style.width = `${adjustedWidth}px`;
    dragImage.style.height = `${adjustedHeight}px`;
    dragImage.style.backgroundColor = color;
    dragImage.style.borderRadius = `${adjustedBorderRadius}px`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.opacity = '1';
    dragImage.style.display = 'flex';
    dragImage.style.justifyContent = 'center';
    dragImage.style.alignItems = 'center';
    dragImage.style.color = inUnitLabelColor;
    dragImage.style.fontSize = `${adjustedFontSize}px`; // Set font size based on scale
    dragImage.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(dragImage);

    const img = document.createElement('img');
    img.src = image;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = `${adjustedBorderRadius}px`;
    img.style.objectFit = 'cover';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.zIndex = '-1';

    const text = document.createElement('div');
    text.innerText = inUnitLabel;
    text.style.position = 'absolute';
    text.style.zIndex = '1';
    text.style.fontSize = `${adjustedFontSize}px`; // Set font size based on scale

    dragImage.appendChild(img);
    dragImage.appendChild(text);

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
                backgroundPosition: 'center',
                color: unit.in_unit_label_color,
                textShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
              }}
            >
              {unit.in_unit_label}
            </div>
            <div className="unit-description">{unitId}</div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitInventory;



