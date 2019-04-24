import React, { Component } from "react";
import * as d3 from "d3";
import { HistDetDimensions } from "./dimensions.js";

const { width, height, margin, colors } = HistDetDimensions;

const data = [
  {
    issue: "name",
    planned: 10,
    actual: 4,
    difference: -60
  },
  {
    issue: "name1",
    planned: 8,
    actual: 7,
    difference: 12.5
  },
  {
    issue: "name2",
    planned: 7,
    actual: 9,
    difference: 28.6
  },
  {
    issue: "name3",
    planned: 5,
    actual: 5,
    difference: 0
  },
  {
    issue: "name4",
    planned: 14,
    actual: 10,
    difference: -28.6
  }
];

//TO DO:  Convert to dynamic using Object.keys.  !!Data from server should be in order issue->difference->planned->acutal
data.columns = ["issue", "difference", "planned", "actual"];
data.y0 = "Time";
data.y1 = "%";

const keys = data.columns.slice(2);
const legendKeys = data.columns.slice(1);

class HistoricalChart extends Component {
  state = {
    bars: [],
    containers: []
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft().tickFormat(d => `${d} hrs`);
  yAxisRight = d3.axisRight().tickFormat(d => `${d}%`);

  static getDerivedStateFromProps(nextProps, prevState) {
    //Creates scale for each set of bar's container
    var x0 = d3
      .scaleBand()
      .domain(data.map(d => d.issue))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.1);
    //Creates scales for rendered bars within each <g> container
    var x1 = d3
      .scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    //Max between both planned and actual
    var yScaleMax = d3.max(data, d => d3.max(keys, key => d[key]));
    //Shifts xscale upwards by 1/2 of the max -> requirements for second Y axis (%)
    var yScaleMin = yScaleMax / -2;

    //Creates y scale for time
    var y = d3
      .scaleLinear()
      .domain([yScaleMin, yScaleMax])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    //Helper to identify where the new "0" point is on the Y-Axis
    var xAxisPosition = y(0);

    const containers = data.map(d => x0(d.issue));

    const bars = data.map(d => {
      var subBars = [];
      keys.forEach(key => {
        subBars.push({
          x: x1(key),
          y: y(d[key]),
          width: x1.bandwidth(),
          height: y(0) - y(d[key]),
          fill: colors[key]
        });
      });
      return subBars;
    });

    //Min for % differences
    var yPercentMin = d3.min(data, d => d.difference);

    //Calculates the new Y- scaled ratio to keep the % Y-axis in line with shifted time Y-axis.
    var multiplyer = Math.ceil(Math.abs(yPercentMin / yScaleMin));

    var yPercentScale = d3
      .scaleLinear()
      .domain([yScaleMin * multiplyer, yScaleMax * multiplyer])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x(d => x0(d.issue))
      .y(d => yPercentScale(d.difference));

    const lineGraph = line(data);
    return { bars, containers, x0, y, xAxisPosition, lineGraph, yPercentScale };
  }

  componentDidMount() {
    this.xAxis.scale(this.state.x0);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.y);
    d3.select(this.refs.yAxis).call(this.yAxis);
    this.yAxisRight.scale(this.state.yPercentScale);
    d3.select(this.refs.yAxisRight).call(this.yAxisRight);
  }

  render() {
    return (
      <svg width={width} height={height}>
        {this.state.containers.map((d, index) => (
          <g transform={`translate(${d}, 0)`}>
            {this.state.bars[index].map(bar => (
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={bar.fill}
              />
            ))}
          </g>
        ))}
        <g
          ref="xAxis"
          transform={`translate(0, ${this.state.xAxisPosition})`}
        />
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        <g
          ref="yAxisRight"
          transform={`translate(${width - margin.right}, 0)`}
        />
        <path
          d={this.state.lineGraph}
          fill="none"
          stroke={colors.difference}
          transform={`translate(${this.state.x0.bandwidth() / 2}, 0)`}
        />
        <g
          ref="legend"
          transform={`translate(${width / 2 - 100},${height - margin.bottom})`}
        >
          {legendKeys.map((d, i) => (
            <g key={d} transform={`translate(${i * 80},0)`}>
              <rect y="-13" width="20" height="20" fill={colors.d} />
              <text transform={`translate(25,0)`}>{d}</text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default HistoricalChart;
