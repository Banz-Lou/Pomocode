import React, { Component } from "react";
import * as d3 from "d3";
import { DetailsGraphsDimensions } from "./dimensions.js";

const { width, height, margin, colors, legend } = DetailsGraphsDimensions;
const legendKeys = ["Active", "Idle", "Plan", "Total"];
//FIX CREATED AT DATE FOR X AXIS
const graphData = [
  {
    createdAt: "yes",
    intervalId: 1,
    active: 5,
    idle: 2,
    total_idle: 2,
    total_active: 5,
    plan: 25
  },
  {
    createdAt: "no",
    intervalId: 2,
    active: 6,
    idle: 2,
    total_idle: 4,
    total_active: 11,
    plan: 25
  },
  {
    createdAt: "maybe",
    intervalId: 1,
    active: 10,
    idle: 5,
    total_idle: 9,
    total_active: 21,
    plan: 25
  }
];

class IssueDetailsChart extends Component {
  state = {
    bars: [],
    totalLineGraph: [],
    planLineGraph: [],
    totalLineAreaGraph: []
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
      .range([height - margin.bottom, margin.top]);

    const xScale = d3
      .scaleBand()
      .domain(graphData.map(d => d.createdAt))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.1);

    const xBandwidth = xScale.bandwidth() / 2;

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
      .x(d => xScale(d.createdAt) + xBandwidth)
      .y(d => yScale(d.total_active + d.total_idle));

    const planLine = d3
      .line()
      .x(d => xScale(d.createdAt) + xBandwidth)
      .y(d => yScale(d.plan));

    const totalLineArea = d3
      .area()
      .x(d => xScale(d.createdAt) + xBandwidth)
      .y0(height - margin.bottom)
      .y1(d => yScale(d.total_active + d.total_idle));

    const totalLineGraph = line(graphData);
    const planLineGraph = planLine(graphData);
    const totalLineAreaGraph = totalLineArea(graphData);

    return {
      xScale,
      yScale,
      bars,
      totalLineGraph,
      planLineGraph,
      totalLineAreaGraph,
      xBandwidth
    };
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
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        {this.state.bars.map(d => (
          <rect
            x={d.x + this.state.xBandwidth - 5}
            y={d.y}
            width={10}
            height={d.height}
            fill={d.fill}
          />
        ))}
        <path d={this.state.totalLineGraph} stroke="blue" fill="none" />
        <path
          d={this.state.totalLineAreaGraph}
          fill="lightsteelblue"
          fillOpacity="0.2"
        />
        <path d={this.state.planLineGraph} stroke={"green"} fill="none" />
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
              <text transform={`translate(25,7)`}>{d}</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default IssueDetailsChart;
