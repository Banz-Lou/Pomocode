import React, { Component } from "react";
import * as d3 from "d3";
import { DetailsGraphsDimensions } from "./dimensions.js";

const { width, height, margin, colors, legend } = DetailsGraphsDimensions;

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

class IssueDetailsChartz extends Component {
  state = {
    bars: []
  };
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft().tickFormat(d => `${d} hrs`);

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
      .range([height, 0]);

    const xScale = d3
      .scaleBand()
      .domain(graphData.map(d => d.createdAt))
      .range([0, width]);

    console.log(stackData);
    console.log(xScale(1));

    let xBandwith = xScale.bandwidth();

    stackData.forEach(index => {
      let result = index.map(d => {
        return {
          x: xScale(d.data.createdAt) + xBandwith / 2 - 5,
          y: yScale(d[1]),
          height: yScale(d[0]) - yScale(d[1])
        };
      });
      bars = bars.concat(result);
    });

    return { xScale, yScale, bars, xBandwith };
  }

  componentDidMount() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" />
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
        ))}
        <rect x={0} y={325} width={10} height={50} fill={"blue"} />
      </svg>
    );
  }
}

export default IssueDetailsChartz;
