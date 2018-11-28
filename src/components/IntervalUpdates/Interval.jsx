import React from 'react';
import IntervalIssue from './IntervalIssue';

var Interval = ({ item }) => {
	return (
		<div>
			{item.map(issue => (
				<IntervalIssue issue={issue} />
			))}
		</div>
	);
};

export default Interval;
