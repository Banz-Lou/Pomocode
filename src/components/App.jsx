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
			<React.Fragment>
				<div id="header">Header</div>
				<div id="container">
					<div className="sub-container">
						<IntervalsContainer />
						<DetailsContainer />
					</div>
					<div className="sub-container">
						<HistoricalContainer />
						<PlansContainer />
					</div>
				</div>
			</React.Fragment>
		</Provider>
	);
};

export default App;
