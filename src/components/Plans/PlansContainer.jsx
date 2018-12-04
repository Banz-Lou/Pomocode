import React from 'react';
import { PlansList } from './PlansList';
import Planner from './Planner';

var PlansContainer = () => {
  return (
    <div>
      <Planner />
      <PlansList />
    </div>
  );
};

export default PlansContainer;
