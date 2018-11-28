import React from 'react';
import { DetailsGraph } from './DetailsGraph';
import { DetailsStats } from './DetailsStats';

var DetailsContainer = () => {
	return (
		<div id="details">
			<DetailsGraph />
			<DetailsStats />
		</div>
	);
};

export default DetailsContainer;
