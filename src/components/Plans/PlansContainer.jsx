import React from 'react';
import ActiveIssues from './ ActiveIssues';
import Planner from './Planner';

const PlansContainer = () => {
	return (
		<div id="planning" className="inner-sub-container">
			<Planner />
			<ActiveIssues />
		</div>
	);
};

export default PlansContainer;
