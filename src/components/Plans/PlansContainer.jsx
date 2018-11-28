import React from 'react';
import { PlansList } from './PlansList';
import { Planner } from './Planner';

var PlansContainer = () => {
	return (
		<div>
			<PlansList />
			<Planner />
		</div>
	);
};

export default PlansContainer;
