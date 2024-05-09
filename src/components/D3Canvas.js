import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Canvas = ({ setScale }) => {
  const ref = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 400;

    d3.select(ref.current).select('g').remove();

    const svg = d3.select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('margin', 'auto')
      .style('background', '#f8f8f8')
      .style('border', '1px solid black');

    const g = svg.append('g');

    const bgWidth = 10 * width;
    const bgHeight = 10 * height;

    g.append('rect')
      .attr('width', bgWidth)
      .attr('height', bgHeight)
      .attr('fill', '#545454');

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setScale(event.transform.k);
      });

    svg.call(zoomBehavior);

    function handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();

      const transform = d3.zoomTransform(svg.node());
      const pointer = d3.pointer(event, svg.node());

      const originalWidth = parseFloat(event.dataTransfer.getData('width'));
      const originalHeight = parseFloat(event.dataTransfer.getData('height'));
      const color = event.dataTransfer.getData('color');

      const x = transform.invertX(pointer[0]) - originalWidth / 2;
      const y = transform.invertY(pointer[1]) - originalHeight / 2;

      if (x >= 0 && x <= bgWidth && y >= 0 && y <= bgHeight) {
        createComponent(x, y, originalWidth, originalHeight, color);
      }
    }

    function createComponent(x, y, w, h, color) {
      const clipId = `clip-${Math.random().toString(36).substring(2, 10)}`;
    
      const newComponent = g.append('g')
        .attr('transform', `translate(${x}, ${y})`);

      newComponent.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('rx', 10)
        .attr('ry', 10)
        .style('fill', color)
        .style('cursor', 'pointer');

      newComponent.append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('rx', 10)
        .attr('ry', 10);

      newComponent.append('image')
        .attr('xlink:href', 'https://via.placeholder.com/150')
        .attr('width', w)
        .attr('height', h)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    
      applyDragBehavior(newComponent);
    }
    

    function applyDragBehavior(component) {
      let offsetX, offsetY;
    
      const dragHandler = d3.drag()
        .on('start', function (event) {
          const transform = d3.select(this).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
          const initialX = parseFloat(transform[1]);
          const initialY = parseFloat(transform[2]);
          offsetX = event.x - initialX;
          offsetY = event.y - initialY;
          d3.select(this).raise().classed('active', true)
            .style('cursor', 'grabbing');
        })
        .on('drag', function (event) {
          const newX = Math.max(0, Math.min(bgWidth - parseFloat(d3.select(this).select('rect').attr('width')), event.x - offsetX));
          const newY = Math.max(0, Math.min(bgHeight - parseFloat(d3.select(this).select('rect').attr('height')), event.y - offsetY));
          d3.select(this).attr('transform', `translate(${newX}, ${newY})`)
            .style('cursor', 'grabbing');
        })
        .on('end', function (event) {
          d3.select(this).classed('active', false);
        });
    
      dragHandler(component);
    }

    svg.on('dragover', function (event) {
      event.preventDefault();
    })
      .on('drop', handleDrop)
      .on('dragenter', function (event) {
        event.preventDefault();
      });

  }, [setScale]);

  return <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>;
};

export default D3Canvas;


