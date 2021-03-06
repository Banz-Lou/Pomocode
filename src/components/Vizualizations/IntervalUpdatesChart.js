import React, { Component } from "react";
import * as d3 from "d3";
import { IntUpdDimensions } from "./dimensions.js";

const { width, height, margin, colors, legend, barHeight } = IntUpdDimensions;
const legendKeys = ["Plan", "Active", "Prior Active"];

// let data = [
//   {
//     id: 1,
//     type: "Plan",
//     plan_seconds: 3840
//   },
//   {
//     id: 1,
//     type: "Active",
//     prior_active: 3000,
//     active: 600
//   }
// ];

class IntervalUpdatesChart extends Component {
  state = {
    bars: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;

    //Create stack data
    let stack = d3.stack().keys(["prior_active", "active"]);

    let stackData = stack([data[1]]);
    let activeBars = [];

    // obtain y max
    let xMax = data.reduce((max, obj) => {
      let totalActive = obj.prior_active + obj.active || 0;
      let planSeconds = obj.plan_seconds || 0;
      return Math.max(max, totalActive, planSeconds);
    }, 0);

    // create x scale
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([0, width - margin.right]);

    // create y scale

    const yScale = d3
      .scaleLinear()
      .domain([1, 1])
      .range([0, height]);

    // STACKED CHART color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(stackData.keys())
      .range([colors.active, colors.prior_active]);

    //ACTIVE -> STACKED CHART
    stackData.forEach((bar, i) => {
      let xpos = i > 0 ? bar[0][0] : 0;
      let result = {
        y: yScale(1),
        x: xScale(xpos),
        width: xScale(bar[0][1]) - xScale(bar[0][0]),
        fill: colorScale(bar.key)
      };
      activeBars = activeBars.concat(result);
    });

    // PLANNED BAR
    const planBars = [data[0]].map(d => {
      return {
        y: yScale(1),
        x: xScale(0),
        width: xScale(d.plan_seconds) - xScale(0),
        fill: colors.planned
      };
    });

    return { activeBars, planBars };
  }

  render() {
    return (
      <svg width={width} height={height} style={{ border: "solid 5px" }}>
        <g>
          {this.state.planBars.map(d => (
            <rect
              x={d.x}
              y={d.y - barHeight / 2}
              width={d.width}
              height={barHeight}
              fill={d.fill}
            />
          ))}
        </g>
        <g>
          {this.state.activeBars.map(d => (
            <rect
              x={d.x}
              y={d.y + barHeight / 2}
              width={d.width}
              height={barHeight}
              fill={d.fill}
            />
          ))}
        </g>
        <g
          ref="legend"
          transform={`translate(${legend.positionX},${legend.positionY})`}
        >
          {legendKeys.map((d, i) => (
            <g key={d} transform={`translate(0, ${i * (legend.rectH + 5)})`}>
              <rect
                y={legend.rectY}
                width={legend.rectW}
                height={legend.rectH}
                fill={legend[d]}
              />
              <text transform={`translate(25,0)`}>{d}</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default IntervalUpdatesChart;
