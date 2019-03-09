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
		lineGraph: [],
		lineArea: []
	};

	static getDerivedStatesFromProps(nextProps, prevState) {
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
	}
	render() {
		return <svg width={width} height={height} />;
	}
}

export default HistoricalChart;
