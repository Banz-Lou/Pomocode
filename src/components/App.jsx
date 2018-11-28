import React from 'react';
import IntervalsContainer from './IntervalUpdates/IntervalsContainer';
import HistoricalContainer from './Historical/HistoricalContainer';
import DetailsContainer from './Details/DetailsContainer';
import PlansContainer from './Plans/PlansContainer';

const data = [[1, 2], [1, 2], [1, 2, 3], [1]];

var App = () => {
	return (
		<div id="container">
			<IntervalsContainer data={data} />
			<HistoricalContainer />
			<DetailsContainer />
			<PlansContainer />
		</div>
	);
};

export default App;
