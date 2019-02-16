import React from 'react';
import { HistoricalGraph } from './HistoricalGraph';
import { HistoricalStats } from './HistoricalStats';

var HistoricalContainer = () => {
	return (
		<div id="historical">
			<HistoricalGraph />
			<HistoricalStats />
		</div>
	);
};

export default HistoricalContainer;
