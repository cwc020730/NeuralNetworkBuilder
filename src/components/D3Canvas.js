import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import componentStyles from './ComponentStyles';

const D3Canvas = ({ setScale }) => {
  const ref = useRef(null);
  const arrowContainerRef = useRef(null);
  const idToArrowsMap = new Map();
  const componentList = [];
  let componentOnCanvasId = 0;
  let arrowOnCanvasId = 0;
  let startPoint = null;
  let currentArrow = null;

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
    const arrowContainer = svg.append('g').attr('class', 'arrows');
    arrowContainerRef.current = arrowContainer;

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
        arrowContainer.attr('transform', event.transform);
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
      const componentId = event.dataTransfer.getData('componentId');
      const componentStyle = componentStyles[componentId];

      const x = transform.invertX(pointer[0]) - originalWidth / 2;
      const y = transform.invertY(pointer[1]) - originalHeight / 2;

      if (x >= 0 && x <= bgWidth && y >= 0 && y <= bgHeight) {
        createComponent(x, y, originalWidth, originalHeight, componentStyle);
      }
    }

    function calculateConnectionPoints(x, y, w, h, in_cnt, out_cnt) {
      const inputPoints = Array.from({ length: in_cnt }, (_, index) => ({
        originalX: (index + 1) * (w / (in_cnt + 1)),
        originalY: 0,
        x: (index + 1) * (w / (in_cnt + 1)) + x,
        y: y,
        is_input: true,
        is_output: false
      }));

      const outputPoints = Array.from({ length: out_cnt }, (_, index) => ({
        originalX: (index + 1) * (w / (out_cnt + 1)),
        originalY: h,
        x: (index + 1) * (w / (out_cnt + 1)) + x,
        y: h + y,
        is_input: false,
        is_output: true
      }));

      return [...inputPoints, ...outputPoints];
    }

    function drawArrow(start, end, attachedComponent) {
      const arrow = arrowContainerRef.current
        .append('path')
        .attr('d', d3.line()([[start.x, start.y], [end.x, end.y]]))
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');
    
      const arrowObj = {
        startPoint: start,
        endPoint: end,
        endControl: null,
        startComponent: attachedComponent,
        endComponent: null,
        path: arrow,
        onCanvasId: arrowOnCanvasId
      };

      const endControl = arrowContainerRef.current
        .append('circle')
        .attr('cx', arrowObj.endPoint.x)
        .attr('cy', arrowObj.endPoint.y)
        .attr('r', 0)
        .attr('fill', 'white')
        .style('cursor', 'pointer')
        .on('mousedown', function (event) {
          event.stopPropagation();
          currentArrow = arrowObj;
          startPoint = currentArrow.startPoint;
          if (currentArrow.endComponent) {
            currentArrow.endComponent.attachingArrowEnds = currentArrow.endComponent.attachingArrowEnds.filter(id => id !== currentArrow.onCanvasId);
            currentArrow.endComponent = null;
          }
        })
        .on('mouseup', function (event) {
        });

      arrowObj.endControl = endControl;
    
      idToArrowsMap.set(arrowOnCanvasId, arrowObj);

      arrowOnCanvasId++;
    
      attachedComponent.attachingArrowStarts.push(arrowObj.onCanvasId);
    
      return arrowObj;
    }

    function createComponent(x, y, w, h, style) {
      const { color, image, in_cnt, out_cnt } = style;

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
        .attr('xlink:href', image)
        .attr('width', w)
        .attr('height', h)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');

      const transform = d3.select(newComponent.node()).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
      const X = parseFloat(transform[1]);
      const Y = parseFloat(transform[2]);
      const connectionPoints = calculateConnectionPoints(X, Y, w, h, in_cnt, out_cnt);

      const componentObj = {
        onCanvasId: componentOnCanvasId++, 
        component: newComponent, 
        connectionPoints: connectionPoints,
        attachingArrowStarts: [],
        attachingArrowEnds: []
      };

      newComponent.selectAll('.connection-point')
        .data(connectionPoints)
        .enter()
        .append('circle')
        .attr('class', 'connection-point')
        .attr('cx', d => d.x - X)
        .attr('cy', d => d.y - Y)
        .attr('r', 5)
        .style('fill', 'red')
        .style('cursor', 'crosshair')
        .each(function() {
          d3.select(this).property('isMouseDown', false);
          d3.select(this).property('isConnectedWithArrow', false);
        })
        .on('mouseup', function (event, d) {
        })
        .on('mousedown', function (event, d) {
          event.stopPropagation();
          d3.select(this).property('isMouseDown', true);
          const transform = d3.select(newComponent.node()).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
          const parentX = parseFloat(transform[1]);
          const parentY = parseFloat(transform[2]);
          d.x = parentX + d.originalX;
          d.y = parentY + d.originalY;
          startPoint = { x: d.x, y: d.y };
        })
        .on('mouseover', function () {
          d3.select(this).style('fill', 'green');
        })
        .on('mouseout', function (event, d) {
          if (!d3.select(this).property('isConnectedWithArrow')) {
            d3.select(this).style('fill', 'red');
          }
          else {
            d3.select(this).style('fill', 'pink');
          }
          if (d3.select(this).property('isMouseDown') && !d3.select(this).property('isConnectedWithArrow') && d.is_output) {
            currentArrow = drawArrow(startPoint, startPoint, componentObj);
            d3.select(this).property('isConnectedWithArrow', true);
            d3.select(this).style('fill', 'pink');
          }
        });

      applyDragBehavior(componentObj);
      
      componentList.push(componentObj);

    }

    function updateArrows(arrows = []) {
      arrows.forEach(arrow => {
        arrow.path.attr('d', d3.line()([[arrow.startPoint.x, arrow.startPoint.y], [arrow.endPoint.x, arrow.endPoint.y]]));
        arrow.endControl.attr('cx', arrow.endPoint.x).attr('cy', arrow.endPoint.y);
      });

    }

    function applyDragBehavior(componentObj) {
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
          const transform = d3.select(this).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
          const initialX = parseFloat(transform[1]);
          const initialY = parseFloat(transform[2]);
          const rect = d3.select(this).select('rect');
          const width = parseFloat(rect.attr('width'));
          const height = parseFloat(rect.attr('height'));
          const newX = Math.max(0, Math.min(bgWidth - width, event.x - offsetX));
          const newY = Math.max(0, Math.min(bgHeight - height, event.y - offsetY));
    
          d3.select(this).attr('transform', `translate(${newX}, ${newY})`)
            .style('cursor', 'grabbing');
    
          d3.select(this).selectAll('.connection-point')
            .each(function (d) {
              d.x = newX + d.originalX;
              d.y = newY + d.originalY;
            });
          
          for (let id of componentObj.attachingArrowStarts) {
            const arrow = idToArrowsMap.get(id);
            arrow.startPoint = { x: (newX - initialX) + arrow.startPoint.x, y: (newY - initialY) + arrow.startPoint.y };
            updateArrows([arrow]);
          }
          for (let id of componentObj.attachingArrowEnds) {
            const arrow = idToArrowsMap.get(id);
            arrow.endPoint = { x: (newX - initialX) + arrow.endPoint.x, y: (newY - initialY) + arrow.endPoint.y };
            updateArrows([arrow]);
          }
        })
        .on('end', function (event) {
          d3.select(this).classed('active', false)
            .style('cursor', 'grab');
        });
    
      dragHandler(componentObj.component);
    }

    svg.each(function () {
        d3.select(this).property('isMouseDown', false);
      })
      .on('mousedown', function (event) {
      })
      .on('mousemove', function (event) {
        if (currentArrow && startPoint) {
          console.log('mousemove with currentArrow');
          const pointer = d3.pointer(event, svg.node());
          const transform = d3.zoomTransform(svg.node());
          const transformedPointer = [transform.invertX(pointer[0]), transform.invertY(pointer[1])];
          currentArrow.endControl.attr('cx', transformedPointer[0]).attr('cy', transformedPointer[1]);
          currentArrow.endControl.attr('r', 2);
          currentArrow.path.attr('d', d3.line()([[startPoint.x, startPoint.y], [transformedPointer[0], transformedPointer[1]]]));
        }
      })
      .on('mouseup', function (event) {
        console.log('mouseup');
        if (currentArrow) {
          const pointer = d3.pointer(event, svg.node());
          const transform = d3.zoomTransform(svg.node());
          const transformedPointer = [transform.invertX(pointer[0]), transform.invertY(pointer[1])];
          let connectedComponent = null;
          let connectedPoint = null;
          componentList.forEach(comp => {
            comp.connectionPoints.forEach(point => {
              if (Math.sqrt((point.x - transformedPointer[0]) ** 2 + (point.y - transformedPointer[1]) ** 2) < 10 && point.is_input) {
                connectedComponent = comp;
                connectedPoint = point;
                // set the connectedPoint style to be pink
                console.log('connected');
              }
            });
          });

          if (connectedComponent && connectedPoint) {
            currentArrow.endPoint = { x: connectedPoint.x, y: connectedPoint.y };
            currentArrow.endComponent = connectedComponent;
            connectedComponent.attachingArrowEnds.push(currentArrow.onCanvasId);
          } else {
            currentArrow.endPoint = { x: transformedPointer[0], y: transformedPointer[1] };
          }
          updateArrows([currentArrow]);
          currentArrow = null;
          startPoint = null;
        }
      })
      .on('dragover', function (event) {
        event.preventDefault();
      })
      .on('drop', handleDrop)
      .on('dragenter', function (event) {
        event.preventDefault();
      });

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 7)
      .attr('refX', 10)
      .attr('refY', 3.5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3.5, 0 7')
      .attr('fill', 'blue');

  }, [setScale]);

  return <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>;
};

export default D3Canvas;
