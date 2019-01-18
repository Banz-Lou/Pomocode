import React from 'react';
import ActiveIssues from './ ActiveIssues';
import Planner from './Planner';

const PlansContainer = () => {
  return (
    <div>
      <Planner />
      <ActiveIssues />
    </div>
  );
};

export default PlansContainer;
