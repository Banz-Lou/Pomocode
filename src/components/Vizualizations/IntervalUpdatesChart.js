import React, { Component } from 'react';
import * as d3 from 'd3';
import { HistDetDimensions } from './dimensions.js';

const { width, height, margin, colors } = HistDetDimensions;

//What we want before .map

// var data = [ {int:1, issue:1 },{int:1, issue:2}, {int:2, issue:1},{int:3, issue:1}];

// function testTransform(data){
// var max = 3;

// var obj = {};
// obj[max] = [];
// obj[max-1] = [];
// obj[max-2]= [];

// console.log(obj);
// data.forEach(issue => {
//     obj[issue.int].push(issue);
// })

// return Object.values(obj);

// }

// testTransform(data)

// var issueData =  {int:1, issue_id:1, issue: {plan_seconds: 100, issue_name: 'TEST'}, prior_active: 20, total_active: 30  }

// let array = [];
// let objPlan = {category: 'plan', plan: issueData.issue.plan_seconds};
// let objActive = {category: 'active', prior_active: issueData.prior_active, active: issueData.total_active};

let data = [
	{
		id: 1,
		type: 'Plan',
		plan_seconds: 3840
	},
	{
		id: 1,
		type: 'Active',
		prior_active: 3000,
		active: 200
	}
];

class IntervalUpdatesChart extends Component {
	state = {
		bars: []
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		//Create stack data
		let stack = d3
			.stack()
			.keys(['prior_active', 'active'])
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);

		let stackData = stack([data[1]]);
		let activeBars = [];

		// obtain y max
		let yMax = data.reduce((max, obj) => {
			let totalActive = obj.prior_active + obj.active || 0;
			let planSeconds = obj.plan_seconds || 0;
			return Math.max(max, totalActive, planSeconds);
		}, 0);

		// create y scale
		const yScale = d3
			.scaleLinear()
			.domain([0, yMax])
			.range([height - margin.bottom, margin.top]);

		// create x scale
		const xExtent = d3.extent(data, d => d.id);
		const xScale = d3
			.scaleLinear()
			.domain(xExtent)
			.range([margin.left, width - margin.right]);

		const colorScale = d3
			.scaleOrdinal()
			.domain(stackData.keys())
			.range(['orange', 'green']);

		stackData.forEach(index => {
			let result = index.map(d => {
				return {
					x: xScale(d.id),
					y: yScale(d[1]),
					height: yScale(d[0]) - yScale(d[1]),
					fill: colorScale(index.key)
				};
			});
			activeBars = activeBars.concat(result);
		});
		//console.log(activeBars);

		const planBars = [data[0]].map(d => {
			return {
				x: xScale(d.id),
				y: yScale(d.plan_seconds),
				height: yScale(0) - yScale(d.plan_seconds),
				fill: 'blue'
			};
		});

		return { activeBars, planBars };
	}

	render() {
		return (
			<svg width={width} height={height}>
				<g transform="rotate(90 200 200)">
					{this.state.planBars.map(d => (
						<rect x={d.x} y={d.y} width={10} height={d.height} fill={d.fill} />
					))}
				</g>
				<g transform="rotate(90 200 200)">
					{this.state.activeBars.map(d => (
						<rect
							x={d.x + 10}
							y={d.y}
							width={10}
							height={d.height}
							fill={d.fill}
						/>
					))}
				</g>
			</svg>
		);
	}
}

export default IntervalUpdatesChart;
