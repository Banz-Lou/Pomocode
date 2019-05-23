import React, { Component } from "react";
import * as d3 from "d3";
import { DetailsGraphsDimensions } from "./dimensions.js";

const { width, height, margin, colors } = DetailsGraphsDimensions;
//FIX CREATED AT DATE FOR X AXIS
const graphData = [
  {
    createdAt: 1,
    intervalId: 1,
    active: 5,
    idle: 2,
    total_idle: 2,
    total_active: 5,
    plan: 25
  },
  {
    createdAt: 2,
    intervalId: 2,
    active: 6,
    idle: 2,
    total_idle: 4,
    total_active: 11,
    plan: 25
  },
  {
    createdAt: 3,
    intervalId: 1,
    active: 10,
    idle: 5,
    total_idle: 9,
    total_active: 21,
    plan: 25
  }
];

// const plan = 15;

class IssueDetailsChart extends Component {
  state = {
    bars: [],
    totalLineGraph: [],
    planLineGraph: [],
    totalLineAreaGraph: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const keys = ["active", "idle"];
    let stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    let stackData = stack(graphData);

    let bars = [];

    let totalTime =
      graphData[graphData.length - 1].total_active +
      graphData[graphData.length - 1].total_idle;
    let yMax = Math.max(graphData[0].plan, totalTime) * 1.1;
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const xExtent = d3.extent(graphData, d => d.createdAt);
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(stackData.keys())
      .range(["#6b486b", "#a05d56"]);

    stackData.forEach(index => {
      let result = index.map(d => {
        return {
          x: xScale(d.data.createdAt),
          y: yScale(d[1]),
          height: yScale(d[0]) - yScale(d[1]),
          fill: colorScale(index.key)
        };
      });
      bars = bars.concat(result);
    });

    const line = d3
      .line()
      .x(d => xScale(d.createdAt))
      .y(d => yScale(d.total_active + d.total_idle));

    const planLine = d3
      .line()
      .x(d => xScale(d.createdAt))
      .y(d => yScale(d.plan));

    const totalLineArea = d3
      .area()
      .x(d => xScale(d.createdAt))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.total_active + d.total_idle));

    const totalLineGraph = line(graphData);
    const planLineGraph = planLine(graphData);
    const totalLineAreaGraph = totalLineArea(graphData);

    return { bars, totalLineGraph, planLineGraph, totalLineAreaGraph };
  }
  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
        ))}
        <path d={this.state.totalLineGraph} stroke="blue" fill="none" />
        <path
          d={this.state.totalLineAreaGraph}
          fill="lightsteelblue"
          fillOpacity="0.2"
        />
        <path d={this.state.planLineGraph} stroke={"green"} fill="none" />
      </svg>
    );
  }
}

export default IssueDetailsChart;
