import React, { Component } from 'react';
import * as d3 from 'd3';

const width = 650;
const height = 400;
const margin = { top: 20, right: 15, bottom: 20, left: 35 };

let data = [
	{
		month: new Date(2015, 0, 1),
		apples: 3840,
		bananas: 1920,
		cherries: 960,
		dates: 400
	},
	{
		month: new Date(2015, 1, 1),
		apples: 1600,
		bananas: 1440,
		cherries: 960,
		dates: 400
	},
	{
		month: new Date(2015, 2, 1),
		apples: 640,
		bananas: 960,
		cherries: 640,
		dates: 400
	},
	{
		month: new Date(2015, 3, 1),
		apples: 320,
		bananas: 480,
		cherries: 640,
		dates: 400
	}
];

class StackedChart extends Component {
	state = {
		bars: []
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		var stack = d3
			.stack()
			.keys(['apples', 'bananas', 'cherries', 'dates'])
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
			.range(['#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

		console.log(colorScale('apples'));

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
		console.log(bars);

		return { bars };
	}

	render() {
		return (
			<svg width={width} height={height}>
				{this.state.bars.map(d => (
					<rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
				))}
			</svg>
		);
	}
}

export default StackedChart;
