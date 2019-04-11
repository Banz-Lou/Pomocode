import React from 'react';
import IntervalUpdatesChart from '../Vizualizations/IntervalUpdatesChart';

var IntervalIssue = ({ issue }) => {
	return (
		<main>
			<IntervalUpdatesChart />
			<div>{issue}</div>
		</main>
	);
};

export default IntervalIssue;
