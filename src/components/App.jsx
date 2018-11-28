import React from 'react';
import IntervalsContainer from './IntervalUpdates/IntervalsContainer';
const data = [[1, 2], [1, 2], [1, 2, 3], [1]];

var App = () => {
	return (
		<div id="container">
			<IntervalsContainer data={data} />
		</div>
	);
};

export default App;
