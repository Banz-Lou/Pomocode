import React from 'react';
import Interval from './Interval';

var IntervalsContainer = ({ data }) => {
	return (
		<div>
			{data.map(item => (
				<Interval item={item} />
			))}
		</div>
	);
};

export default IntervalsContainer;
