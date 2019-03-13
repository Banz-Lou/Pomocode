import React, { Component } from 'react';
import * as d3 from 'd3';
import { HistDetDimensions } from './dimensions.js';

const { width, height, margin } = HistDetDimensions;

const data = [
	{
		issue: 'name',
		planned: 10,
		actual: 4
	},
	{
		issue: 'name1',
		planned: 8,
		actual: 7
	},
	{
		issue: 'name2',
		planned: 7,
		actual: 9
	},
	{
		issue: 'name3',
		planned: 5,
		actual: 5
	},
	{
		issue: 'name4',
		planned: 10,
		actual: 14
	}
];
data.columns = ['issue', 'planned', 'actual'];
data.y0 = 'Time';
data.y1 = '%';

const keys = data.columns.slice(1);

class HistoricalChart extends Component {
	state = {
		bars: [],
		containers: []
	};

	xAxis = d3.axisBottom();
	yAxis = d3.axisLeft().tickFormat(d => `${d} hrs`);

	static getDerivedStateFromProps(nextProps, prevState) {
		var x0 = d3
			.scaleBand()
			.domain(data.map(d => d.issue))
			.rangeRound([margin.left, width - margin.right])
			.paddingInner(0.1);

		var x1 = d3
			.scaleBand()
			.domain(keys)
			.rangeRound([0, x0.bandwidth()])
			.padding(0.05);

		var y = d3
			.scaleLinear()
			.domain([0, d3.max(data, d => d3.max(keys, key => d[key]))])
			.nice()
			.rangeRound([height - margin.bottom, margin.top]);

		var colors = {
			planned: '#98abc5',
			actual: '#ff8c00'
		};

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

		return { bars, containers, x0, y };
	}

	componentDidMount() {
		this.xAxis.scale(this.state.x0);
		d3.select(this.refs.xAxis).call(this.xAxis);
		this.yAxis.scale(this.state.y);
		d3.select(this.refs.yAxis).call(this.yAxis);
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
				<g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
				<g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
			</svg>
		);
	}
}

export default HistoricalChart;
