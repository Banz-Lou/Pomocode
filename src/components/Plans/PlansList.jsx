import React from 'react';

// subscribe component to Planned issues list []

const data = [
  {
    nameWithOwner: 'Fred/octocat'
  },
  {
    nameWithOwner: 'Fred/octocat'
  },
  {
    nameWithOwner: 'Fred/octocat'
  }
];

import { Plan } from './Plan';
export var PlansList = props => {
  return (
    <div>
      "PLANSLIST"
      {data.map(issue => {
        return <Plan />;
      })}
    </div>
  );
};
