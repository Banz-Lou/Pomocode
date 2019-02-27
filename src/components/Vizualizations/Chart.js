import React, { Component } from 'react';
import * as d3 from 'd3';

const width = 650;
const height = 400;
const margin = { top: 20, right: 15, bottom: 20, left: 35 };

let data = [
	{
		date: 1,
		high: Math.random() * 50 + 50,
		low: Math.random() * 20,
		avg: Math.random() * 50 + 20
	},
	{
		date: 2,
		high: Math.random() * 50 + 50,
		low: Math.random() * 20,
		avg: Math.random() * 50 + 20
	},
	{
		date: 3,
		high: Math.random() * 50 + 50,
		low: Math.random() * 20,
		avg: Math.random() * 50 + 20
	},
	{
		date: 4,
		high: Math.random() * 50 + 50,
		low: Math.random() * 20,
		avg: Math.random() * 50 + 20
	}
];

class BarChart extends Component {
	state = {
		bars: []
	};

	xAxis = d3.axisBottom().tickFormat(d3.timeFormat('%b'));
	yAxis = d3.axisLeft().tickFormat(d => `${d}℉`);

	static getDerivedStateFromProps(nextProps, prevState) {
		//define the low and high range in order to create scale
		const xExtent = d3.extent(data, d => d.date);

		const xScale = d3
			.scaleLinear()
			.domain(xExtent)
			.range([margin.left, width - margin.right]);

		const [min, max] = d3.extent(data, d => d.high);
		const yScale = d3
			.scaleLinear()
			.domain([Math.min(min, 0), max])
			.range([height - margin.bottom, margin.top]);

		const colorExtent = d3.extent(data, d => d.avg).reverse();
		const colorScale = d3
			.scaleSequential()
			.domain(colorExtent)
			.interpolator(d3.interpolateRdYlBu);

		const bars = data.map(d => {
			return {
				x: xScale(d.date),
				y: yScale(d.high),
				height: yScale(d.low) - yScale(d.high),
				fill: colorScale(d.avg)
			};
		});
		// console.log(bars);
		return { bars, xScale, yScale };
	}

	componentDidUpdate() {
		this.xAxis.scale(this.state.xScale);
		d3.select(this.refs.xAxis).call(this.xAxis);
		this.yAxis.scale(this.state.yScale);
		d3.select(this.refs.yAxis).call(this.yAxis);
	}

	render() {
		return (
			<svg width={width} height={height}>
				{this.state.bars.map(d => (
					<rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
				))}
				<g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
				<g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
			</svg>
		);
	}
}

export default BarChart;
