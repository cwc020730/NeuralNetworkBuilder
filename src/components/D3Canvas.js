import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Canvas = () => {
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
      .attr('fill', '#222');

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    function handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    
      const transform = d3.zoomTransform(svg.node());
      const pointer = d3.pointer(event, svg.node());
    
      const x = transform.invertX(pointer[0]);
      const y = transform.invertY(pointer[1]);
    
      const radius = event.dataTransfer.getData("radius");
      const color = event.dataTransfer.getData("color");
    
      if (x >= 0 && x <= bgWidth && y >= 0 && y <= bgHeight) {
        createCircle(x, y, radius, color);
      }
    }
    
    function createCircle(x, y, radius, color) {
      const newCircle = g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .style('fill', color)
        .style('cursor', 'pointer');
    
      applyDragBehavior(newCircle);
    }
    
    function applyDragBehavior(circle) {
      const dragHandler = d3.drag()
        .on("start", function (event) {
          d3.select(this).raise().classed("active", true);
        })
        .on("drag", function (event) {
          const radius = d3.select(this).attr("r");
          const newX = Math.max(radius, Math.min(bgWidth - radius, event.x));
          const newY = Math.max(radius, Math.min(bgHeight - radius, event.y));
          d3.select(this)
            .attr("cx", newX)
            .attr("cy", newY);
        })
        .on("end", function (event) {
          d3.select(this).classed("active", false);
        });
    
      dragHandler(circle);
    }

    svg.on("dragover", function(event) {
        event.preventDefault();
    })
    .on("drop", handleDrop)
    .on("dragenter", function(event) {
      event.preventDefault();
    });

    const circle = g.append('circle')
                    .attr('cx', width / 2)
                    .attr('cy', height / 2)
                    .attr('r', 50)
                    .style('fill', 'steelblue')
                    .style('cursor', 'pointer');

    const dragHandler = d3.drag()
      .on("start", function (event, d) {
        d3.select(this).raise().classed("active", true);
      })
      .on("drag", function (event, d) {
        const radius = d3.select(this).attr("r");
        const newX = Math.max(radius, Math.min(bgWidth - radius, event.x));
        const newY = Math.max(radius, Math.min(bgHeight - radius, event.y));
        d3.select(this)
          .attr("cx", newX)
          .attr("cy", newY);
      })
      .on("end", function (event, d) {
        d3.select(this).classed("active", false);
      });

    dragHandler(circle);

  }, []);

  return <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>;
};

export default D3Canvas;

