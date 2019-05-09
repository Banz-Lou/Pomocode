import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 40, bottom: 20, left: 35 };

let data = [
  {
    month: new Date(2015, 0, 1),
    apples: 3840,
    bananas: 1920,
    cherries: 960,
    dates: 400
  },
  {
    month: new Date(2015, 0, 2),
    apples: 1600,
    bananas: 1440,
    cherries: 960,
    dates: 400
  },
  {
    month: new Date(2015, 0, 3),
    apples: 640,
    bananas: 960,
    cherries: 640,
    dates: 400
  },
  {
    month: new Date(2015, 0, 4),
    apples: 320,
    bananas: 480,
    cherries: 640,
    dates: 400
  }
];

const lineData = [
  { a: new Date(2015, 1, 1), b: 200 },
  { a: new Date(2015, 1, 2), b: 2000 },
  { a: new Date(2015, 1, 3), b: 2500 },
  { a: new Date(2015, 1, 4), b: 1200 }
];

class StackedChart extends Component {
  state = {
    bars: [],
    lineGraph: [],
    lineArea: []
  };

  //create a new object

  // keys: ['apples', 'bananas', 'cherries', 'dates']
  // colors: ["rgy1324","rgy1324","rgy1324","rgy1324"]

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    var stack = d3
      .stack()
      .keys(["apples", "bananas", "cherries", "dates"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    let stackData = stack(data);
    let bars = [];

    let yMax = stackData[stackData.length - 1].reduce((max, arr) => {
      return max < arr[1] ? arr[1] : max;
    }, Number.NEGATIVE_INFINITY);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const xExtent = d3.extent(data, d => d.month);
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(stackData.keys())
      .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // console.log(colorScale('apples'));

    stackData.forEach(index => {
      let result = index.map(d => {
        return {
          x: xScale(d.data.month),
          y: yScale(d[1]),
          height: yScale(d[0]) - yScale(d[1]),
          fill: colorScale(index.key)
        };
      });
      bars = bars.concat(result);
    });

    const x = d3
      .scaleTime()
      .domain(d3.extent(lineData, d => d.a))
      .range([margin.left + 5, width - margin.right + 5]);
    // console.log(x(3));
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(lineData, d => d.b)])
      .range([height - margin.bottom, margin.top]);

    // console.log(y(4));

    const line = d3
      .line()
      .x(d => x(d.a))
      .y(d => y(d.b));

    const area = d3
      .area()
      .x(d => x(d.a))
      .y0(height - margin.bottom)
      .y1(d => y(d.b));

    const lineArea = area(lineData);
    // console.log(lineArea);
    const lineGraph = line(lineData);
    // console.log(lineGraph);

    return { bars, lineGraph, lineArea, x, y };
  }

  componentDidMount() {
    this.xAxis
      .scale(this.state.x)
      .ticks(4)
      .tickFormat(d3.timeFormat("%B %d"));
    d3.select(this.refs.xAxis).call(this.xAxis);
    // console.log('test');
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.bars.map(d => (
          <rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
        ))}
        <path d={this.state.lineGraph} fill="none" stroke="blue" />
        <path d={this.state.lineArea} fill="lightsteelblue" fillOpacity="0.2" />
        <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
      </svg>
    );
  }
}

export default StackedChart;
