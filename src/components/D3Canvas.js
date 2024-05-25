import React, { useEffect, useRef, useContext, useState } from 'react';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import unitList from './UnitList.json';
import { AppContext } from './AppContext';

export const idToUnitMap = new Map();
export let existedUnitList = [];
export function updateUnitParameters(unitId, parameters) {
  const unit = idToUnitMap.get(unitId);
  if (unit) {
    unit.parameters = parameters;
    // console.log('Unit' + unitId + ' parameters updated:', unit.parameters);
    // redrawUnit(unit); // Pseudocode for updating the visual representation
  }
}
export function generateJSONCanvasRepresentation() {
  let unitPosMap = new Map();
  let arrowMap = new Map();
  for (let unit of existedUnitList) {
    const transform = d3.select(unit.unit.node()).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
    const x = parseFloat(transform[1]);
    const y = parseFloat(transform[2]);
    unitPosMap.set(unit.onCanvasId, 
      { 
        unitInfo: {
          type: unit.type,
          connectionPoints: unit.connectionPoints,
          attachingArrowStarts: unit.attachingArrowStarts,
          attachingArrowEnds: unit.attachingArrowEnds,
          parameters: unit.parameters
        },
        x: x,
        y: y,
      }
    );
    for (let arrowId of unit.attachingArrowStarts) {
      const arrow = idToArrowsMap.get(arrowId);
      arrowMap.set(arrowId, {
        startPoint: arrow.startPoint,
        endPoint: arrow.endPoint,
        startUnitId: arrow.startUnit ? arrow.startUnit.onCanvasId : null,
        endUnitId: arrow.endUnit ? arrow.endUnit.onCanvasId : null,
        startAnchorPointId: arrow.startAnchorPointId,
        endAnchorPointId: arrow.endAnchorPointId
      });
    }
  }
  return {
    units: Object.fromEntries(unitPosMap),
    arrows: Object.fromEntries(arrowMap)
  };
}

export function loadJSONCanvasRepresentation(jsonData) {
  // Clear the canvas first
  removeAllObjectsOnCanvas();

  // Destructure units and arrows from the jsonData
  const { units, arrows } = jsonData;

  // Helper function to create units
  const createUnitFromJSON = (unitId, unitData) => {
    const { x, y, unitInfo } = unitData;
    const { type, connectionPoints, attachingArrowStarts, attachingArrowEnds, parameters } = unitInfo;

    // Find unit data from unitList by type
    const unitTypeData = unitList[type];

    if (unitTypeData) {
      const width = 160;
      const height = 60;

      // Create the unit
      window.createUnit(x, y, width, height, unitTypeData,
      { onCanvasId: unitId, connectionPoints, attachingArrowEnds, parameters }, true);

    } else {
      console.error(`Unit type ${type} not found in unitList`);
    }
  };

  // Helper function to create arrows
  const createArrowFromJSON = (arrowId, arrowData) => {
    const { startPoint, endPoint, startUnitId, endUnitId, startAnchorPointId, endAnchorPointId } = arrowData;

    // Get the start and end units
    const startUnit = idToUnitMap.get(startUnitId);
    const endUnit = idToUnitMap.get(endUnitId);

    if (startUnit && endUnit) {
      // Create the arrow
      const arrowObj = window.drawArrow(
        startPoint, 
        endPoint, 
        startUnit,
        startAnchorPointId,
        { endUnit, endAnchorPointId, onCanvasId: arrowId}
    );

      // Add end control
      arrowObj.endControl.attr('cx', endPoint.x).attr('cy', endPoint.y).attr('r', 2);

      // Update connection points
      d3.select(`#${CSS.escape(startAnchorPointId)}`).style('fill', 'pink').property('isConnectedWithArrow', true);
      d3.select(`#${CSS.escape(endAnchorPointId)}`).style('fill', 'pink').property('isConnectedWithArrow', true);

    } else {
      console.error(`Start or end unit not found for arrow ${arrowId}`);
    }
  };

  // Load units
  for (const [unitId, unitData] of Object.entries(units)) {
    createUnitFromJSON(unitId, unitData);
  }

  // Load arrows
  for (const [arrowId, arrowData] of Object.entries(arrows)) {
    createArrowFromJSON(arrowId, arrowData);
  }
}
    

export function removeAllObjectsOnCanvas() {
  // Remove all unit elements from the canvas
  existedUnitList.forEach(unit => {
    unit.unit.remove();
  });

  // Remove all arrow elements from the canvas
  idToArrowsMap.forEach(arrow => {
    arrow.path.remove();
    if (arrow.endControl) {
      arrow.endControl.remove();
    }
  });

  // Clear the lists and maps
  existedUnitList = [];
  idToUnitMap.clear();
  idToArrowsMap.clear();
}

const idToArrowsMap = new Map();

const D3Canvas = () => {
  const ref = useRef(null);
  const arrowContainerRef = useRef(null);
  //const idToArrowsMap = useRef(new Map());
  //const existedUnitList = useRef([]);
  let startPoint = null;
  let currentArrow = null;
  let isUnitClicked = useRef(false);
  let isEndPointDragging = useRef(false);

  const { setScale, selectedUnitId, setSelectedUnitId, setTriggerRender } = useContext(AppContext);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, unitId: null });

  const updateConnectionPoint = (cp, occupied) => {
    cp.occupied = occupied;
    setTriggerRender(prev => prev + 1); // Trigger re-render
  };

  const handleDelete = (unitId) => {
    // handle unit deletion if unitId is not null
    if (unitId) {
      const unit = idToUnitMap.get(unitId);
      // remove the all the attachingArrowStarts
      unit.attachingArrowStarts.forEach(arrowId => {
        const arrow = idToArrowsMap.get(arrowId);
        if (arrow.endUnit) {
          // reset the endAnchorPointId style to red
          d3.select(`#${CSS.escape(arrow.endAnchorPointId)}`).style('fill', 'red').property('isConnectedWithArrow', false);
          updateConnectionPoint(d3.select(`#${CSS.escape(arrow.endAnchorPointId)}`).datum(), false);
          arrow.endUnit.attachingArrowEnds = arrow.endUnit.attachingArrowEnds.filter(id => id !== arrowId);
        }
        arrow.endControl.remove();
        arrow.path.remove();
        idToArrowsMap.delete(arrowId);
      });
      // remove the attachedUnit field from the attachedArrowEnds
      unit.attachingArrowEnds.forEach(arrowId => {
        const arrow = idToArrowsMap.get(arrowId);
        // remove the attachedUnit field from the attachedArrowEnds
        arrow.endUnit = null;
      });
      unit.unit.remove();
      idToUnitMap.delete(unitId);
      existedUnitList = existedUnitList.filter(comp => comp.onCanvasId !== unitId);
      setSelectedUnitId(null);
    }
    else if (contextMenu.arrowId) {
      const arrow = idToArrowsMap.get(contextMenu.arrowId);
      if (arrow.startUnit) {
        arrow.startUnit.attachingArrowStarts = arrow.startUnit.attachingArrowStarts.filter(id => id !== contextMenu.arrowId);
        // reset the startAnchorPointId style to red
        d3.select(`#${CSS.escape(arrow.startAnchorPointId)}`).style('fill', 'red').property('isConnectedWithArrow', false);
        updateConnectionPoint(d3.select(`#${CSS.escape(arrow.startAnchorPointId)}`).datum(), false);
      }
      if (arrow.endUnit) {
        arrow.endUnit.attachingArrowEnds = arrow.endUnit.attachingArrowEnds.filter(id => id !== contextMenu.arrowId);
        // reset the endAnchorPointId style to red
        d3.select(`#${CSS.escape(arrow.endAnchorPointId)}`).style('fill', 'red').property('isConnectedWithArrow', false);
        updateConnectionPoint(d3.select(`#${CSS.escape(arrow.endAnchorPointId)}`).datum(), false);
      }
      arrow.endControl.remove();
      arrow.path.remove();
      idToArrowsMap.delete(contextMenu.arrowId);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };
  
  const handleCopy = (unitId) => {

    setContextMenu({ ...contextMenu, visible: false });
  };
  
  const handleCut = (unitId) => {

    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    const width = 800;
    const height = 400;

    d3.select(ref.current).select('g').remove();

    const svg = d3.select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('margin', 'auto')
      .style('background', '#f8f8f8');

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
      const unitId = event.dataTransfer.getData('unitId');
      const unitData = unitList[unitId];

      const x = transform.invertX(pointer[0]) - originalWidth / 2;
      const y = transform.invertY(pointer[1]) - originalHeight / 2;

      if (x >= 0 && x <= bgWidth && y >= 0 && y <= bgHeight) {
        createUnit(x, y, originalWidth, originalHeight, unitData);
      }
    }

    function calculateConnectionPoints(x, y, w, h, in_cnt, out_cnt, in_label, out_label) {
      const inputPoints = Array.from({ length: in_cnt }, (_, index) => ({
        originalX: (index + 1) * (w / (in_cnt + 1)),
        originalY: 0,
        x: (index + 1) * (w / (in_cnt + 1)) + x,
        y: y,
        is_input: true,
        is_output: false,
        label: in_label[index],
        occupied: false
      }));

      const outputPoints = Array.from({ length: out_cnt }, (_, index) => ({
        originalX: (index + 1) * (w / (out_cnt + 1)),
        originalY: h,
        x: (index + 1) * (w / (out_cnt + 1)) + x,
        y: h + y,
        is_input: false,
        is_output: true,
        label: out_label[index],
        occupied: false
      }));

      return [...inputPoints, ...outputPoints];
    }

    function drawArrow(start, end, attachedUnit, anchorPointId, customParams = null) {
      const arrow = arrowContainerRef.current
        .append('path')
        .attr('d', d3.line()([[start.x, start.y], [end.x, end.y]]))
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)')
        .on('mouseover', function () {
          // change the mouse cursor to a hand
          d3.select(this).style('cursor', 'pointer');
        })
        .on('contextmenu', function (event) {
          event.preventDefault();
          // console.log('right click on arrow');
          setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            unitId: null,
            arrowId: arrowObj.onCanvasId
          });
        });
      
      const customParamsKeys = customParams ? Object.keys(customParams) : [];
    
      const arrowObj = {
        startPoint: start,
        endPoint: end,
        endControl: null,
        startUnit: attachedUnit,
        endUnit: customParamsKeys.includes('endUnit') ? customParams['endUnit'] : null,
        startAnchorPointId: anchorPointId,
        endAnchorPointId: customParamsKeys.includes('endAnchorPointId') ? customParams['endAnchorPointId'] : null,
        path: arrow,
        onCanvasId: customParamsKeys.includes('onCanvasId') ? customParams['onCanvasId'] : uuidv4()
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
          if (currentArrow.endUnit) {
            currentArrow.endUnit.attachingArrowEnds = currentArrow.endUnit.attachingArrowEnds.filter(id => id !== currentArrow.onCanvasId);
            currentArrow.endUnit = null;
            d3.select(`#${CSS.escape(currentArrow.endAnchorPointId)}`).style('fill', 'red').property('isConnectedWithArrow', false);
            updateConnectionPoint(d3.select(`#${CSS.escape(currentArrow.endAnchorPointId)}`).datum(), false);
            currentArrow.endAnchorPointId = null;
          }
        })
        .on('mouseup', function (event) {
          isEndPointDragging.current = true;
        });

        
      arrowObj.endControl = endControl;
    
      idToArrowsMap.set(arrowObj.onCanvasId, arrowObj);
    
      attachedUnit.attachingArrowStarts.push(arrowObj.onCanvasId);
    
      return arrowObj;
    }

    function createUnit(x, y, w, h, unitData, customParams = null, freezeConnectionPointsState = false) {
      const [color, image, in_cnt, out_cnt, inUnitLabel, inUnitLabelColor, type, in_label_raw, out_label_raw, params] = [
        unitData["color"], 
        unitData["image"],
        unitData["input"]["input_cnt"]["default"],
        unitData["output"]["output_cnt"]["default"],
        unitData["in_unit_label"],
        unitData["in_unit_label_color"],
        unitData["primary_label"],
        unitData["input"]["input_labels"],
        unitData["output"]["output_labels"],
        unitData["parameters"]
      ];

      // include custom parameters for convenience
      const customParamsKeys = customParams ? Object.keys(customParams) : [];

      // console.log(color, image, in_cnt, out_cnt, params)

      const clipId = `clip-${Math.random().toString(36).substring(2, 10)}`;

      const newUnit = g.append('g')
        .attr('transform', `translate(${x}, ${y})`);

      const baseRect = newUnit.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('rx', 10)
        .attr('ry', 10)
        .style('fill', color)
        .style('cursor', 'pointer');

      newUnit.append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('rx', 10)
        .attr('ry', 10);

      newUnit.append('image')
        .attr('xlink:href', image)
        .attr('width', w)
        .attr('height', h)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio', 'xMidYMid slice')

      newUnit.append('text')
        .attr('x', w / 2)
        .attr('y', h / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill', inUnitLabelColor)
        .style('font-size', '14px')
        .style('pointer-events', 'none')
        .classed('no-select', true)
        .text(inUnitLabel);

      const transform = d3.select(newUnit.node()).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
      const X = parseFloat(transform[1]);
      const Y = parseFloat(transform[2]);
      const currUnitId = customParamsKeys.includes('onCanvasId') ? customParams['onCanvasId'] : uuidv4();

      const inputLabel = []
      const outputLabel = []

      for (let i = 1; i <= in_cnt; i++) {
        inputLabel.push(in_label_raw[i - 1]);
      }
      
      for (let i = 1; i <= out_cnt; i++) {
        outputLabel.push(out_label_raw[i - 1]);
      }

      const connectionPoints = customParamsKeys.includes('connectionPoints') ? customParams['connectionPoints'] : 
        calculateConnectionPoints(x, y, w, h, in_cnt, out_cnt, inputLabel, outputLabel).map((cp, index) => ({
          ...cp,
          id: `${currUnitId}-cp-${index}`,
          unitId: currUnitId
        }));

      // console.log(connectionPoints)

      for (const [param_name, param_attr] of Object.entries(params)) {
        param_attr['value'] = param_attr['default'];
      }

      const unitObj = {
        type: type,
        onCanvasId: currUnitId, 
        unit: newUnit, 
        connectionPoints: connectionPoints,
        attachingArrowStarts: customParamsKeys.includes('attachingArrowStarts') ? customParams['attachingArrowStarts'] : [],
        attachingArrowEnds: customParamsKeys.includes('attachingArrowEnds') ? customParams['attachingArrowEnds'] : [],
        baseRect: baseRect,
        parameters: customParamsKeys.includes('parameters') ? customParams['parameters'] : params
      };

      // on click event to the unit
      newUnit.on('click', function (event) {
        isUnitClicked.current = true;
        setSelectedUnitId(currUnitId);
      })
      .on('contextmenu', function (event) {
        event.preventDefault();
        // console.log('right click on unit');
        setContextMenu({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          unitId: currUnitId,
          arrowId: null
        });
      });

      newUnit.selectAll('.connection-point')
        .data(connectionPoints)
        .enter()
        .append('circle')
        .attr('class', 'connection-point')
        .attr('id', d => d.id)
        .attr('cx', d => d.x - X)
        .attr('cy', d => d.y - Y)
        .attr('r', 5)
        .style('fill', 'red')
        .style('cursor', 'crosshair')
        .each(function(d) {
          d3.select(this).property('isMouseDown', false);
          d3.select(this).property('isConnectedWithArrow', false);
          if (!freezeConnectionPointsState) {
            updateConnectionPoint(d, false);
          }
        })
        .on('mouseup', function (event, d) {
        })
        .on('mousedown', function (event, d) {
          event.stopPropagation();
          d3.select(this).property('isMouseDown', true);
          const transform = d3.select(newUnit.node()).attr('transform').match(/translate\(([^,]+),([^)]+)\)/);
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
            currentArrow = drawArrow(startPoint, startPoint, unitObj, d.id);
            d3.select(this).property('isConnectedWithArrow', true);
            d3.select(this).style('fill', 'pink');
            updateConnectionPoint(d, true);
          }
        });

      applyDragBehavior(unitObj);
      
      existedUnitList.push(unitObj);
      idToUnitMap.set(currUnitId, unitObj);

    }

    function updateArrows(arrows = []) {
      arrows.forEach(arrow => {
        arrow.path.attr('d', d3.line()([[arrow.startPoint.x, arrow.startPoint.y], [arrow.endPoint.x, arrow.endPoint.y]]));
        arrow.endControl.attr('cx', arrow.endPoint.x).attr('cy', arrow.endPoint.y);
      });

    }

    function applyDragBehavior(unitObj) {
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
          
          for (let id of unitObj.attachingArrowStarts) {
            const arrow = idToArrowsMap.get(id);
            arrow.startPoint = { x: (newX - initialX) + arrow.startPoint.x, y: (newY - initialY) + arrow.startPoint.y };
            updateArrows([arrow]);
          }
          for (let id of unitObj.attachingArrowEnds) {
            const arrow = idToArrowsMap.get(id);
            arrow.endPoint = { x: (newX - initialX) + arrow.endPoint.x, y: (newY - initialY) + arrow.endPoint.y };
            updateArrows([arrow]);
          }
        })
        .on('end', function (event) {
          d3.select(this).classed('active', false)
            .style('cursor', 'grab');
        });
    
      dragHandler(unitObj.unit);
    }

    svg.each(function () {
        d3.select(this).property('isMouseDown', false);
      })
      .on('mousedown', function (event) {
      })
      .on('mousemove', function (event) {
        if (currentArrow && startPoint) {
          // console.log('mousemove with currentArrow');
          const pointer = d3.pointer(event, svg.node());
          const transform = d3.zoomTransform(svg.node());
          const transformedPointer = [transform.invertX(pointer[0]), transform.invertY(pointer[1])];
          currentArrow.endControl.attr('cx', transformedPointer[0]).attr('cy', transformedPointer[1]);
          currentArrow.endControl.attr('r', 2);
          currentArrow.path.attr('d', d3.line()([[startPoint.x, startPoint.y], [transformedPointer[0], transformedPointer[1]]]));
        }
      })
      .on('mouseup', function (event) {
        // console.log('mouseup');
        if (currentArrow) {
          const pointer = d3.pointer(event, svg.node());
          const transform = d3.zoomTransform(svg.node());
          const transformedPointer = [transform.invertX(pointer[0]), transform.invertY(pointer[1])];
          let connectedUnit = null;
          let connectedPoint = null;
          existedUnitList.forEach(comp => {
            comp.connectionPoints.forEach(point => {
              if (Math.sqrt((point.x - transformedPointer[0]) ** 2 + (point.y - transformedPointer[1]) ** 2) < 10 && point.is_input) {
                connectedUnit = comp;
                connectedPoint = point;
                currentArrow.endAnchorPointId = point.id;
                // set the connectedPoint style to be pink
                d3.select(`#${CSS.escape(point.id)}`).style('fill', 'pink').property('isConnectedWithArrow', true);
                updateConnectionPoint(d3.select(`#${CSS.escape(point.id)}`).datum(), true);
                // console.log('connected');
              }
            });
          });

          if (connectedUnit && connectedPoint) {
            currentArrow.endPoint = { x: connectedPoint.x, y: connectedPoint.y };
            currentArrow.endUnit = connectedUnit;
            connectedUnit.attachingArrowEnds.push(currentArrow.onCanvasId);
          } else {
            currentArrow.endPoint = { x: transformedPointer[0], y: transformedPointer[1] };
          }
          updateArrows([currentArrow]);
          console.log('Arrow created:', currentArrow);
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
      })
      .on('click', function (event) {
        // console.log('click on svg', selectedUnitId);
        // remove strokes from selected unit
        if (!isUnitClicked.current && !isEndPointDragging.current) {
          setSelectedUnitId(null);
        }
        isUnitClicked.current = false;
        isEndPointDragging.current = false;
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
      .attr('fill', 'grey');

      window.createUnit = createUnit;
      window.drawArrow = drawArrow;
      window.setTriggerRender = setTriggerRender;

  }, [setScale]);

  useEffect(() => {
    //console.log('activated')
    existedUnitList.forEach((unit) => {
      if (unit.onCanvasId === selectedUnitId) {
        //console.log(unit.baseRect.style('stroke-width'));
        if (unit.baseRect.style('stroke-width') !== 2) {
          //console.log('set stroke')
          unit.baseRect.style('stroke-width', 2).style('stroke', 'black');
        }
        else {
          //console.log('remove stroke')
          unit.baseRect.style('stroke-width', 0);
        }
      } else {
        unit.baseRect.style('stroke-width', 0);
      }
    });
  }, [selectedUnitId]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <>
      <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>
      {contextMenu.visible && (
        <div
          style={{
            position: 'absolute',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            zIndex: 1000,
            padding: '5px',
            cursor: 'default'
          }}
        >
          <ul style={{
            listStyleType: 'none',
            padding: '5px 0',
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            <li style={{
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'background-color 0.3s, color 0.3s'
            }}
              onClick={() => handleCopy(contextMenu.unitId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007BFF';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }}
            >Copy</li>
            <li style={{
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'background-color 0.3s, color 0.3s'
            }}
              onClick={() => handleCut(contextMenu.unitId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007BFF';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }}
            >Cut</li>
            <li style={{
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'background-color 0.3s, color 0.3s'
            }}
              onClick={() => handleDelete(contextMenu.unitId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007BFF';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'black';
              }}
            >Delete</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default D3Canvas;