import React from 'react';
import IntervalsContainer from './IntervalUpdates/IntervalsContainer';
import HistoricalContainer from './Historical/HistoricalContainer';
import DetailsContainer from './Details/DetailsContainer';
import PlansContainer from './Plans/PlansContainer';

import { Provider } from 'react-redux';
import store from '../store';

var App = () => {
	return (
		<Provider store={store}>
			<div id="container">
				<IntervalsContainer />
				<HistoricalContainer />
				<DetailsContainer />
				<PlansContainer />
			</div>
		</Provider>
	);
};

export default App;
