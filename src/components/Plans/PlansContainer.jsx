import React from 'react';
import ActiveIssues from './ ActiveIssues';
import Planner from './Planner';

const PlansContainer = () => {
	return (
		<div id="planning">
			<Planner />
			<ActiveIssues />
		</div>
	);
};

export default PlansContainer;
