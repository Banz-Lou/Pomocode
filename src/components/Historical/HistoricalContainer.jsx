import React from 'react';
import { HistoricalGraph } from './HistoricalGraph';
import { HistoricalStats } from './HistoricalStats';

var HistoricalContainer = () => {
	return (
		<div id="historical" className="inner-sub-container">
			<HistoricalGraph />
			<HistoricalStats />
		</div>
	);
};

export default HistoricalContainer;
