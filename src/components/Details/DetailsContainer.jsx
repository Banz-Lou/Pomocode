import React from 'react';
import { DetailsGraph } from './DetailsGraph';
import { DetailsStats } from './DetailsStats';

var DetailsContainer = () => {
	return (
		<div id="details" className="inner-sub-container">
			<DetailsGraph />
			<DetailsStats />
		</div>
	);
};

export default DetailsContainer;
