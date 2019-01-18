import React from 'react';
export const Active = ({ issue }) => (
  <div>
    {issue.nameWithOwner}
    <div>
      <span>{issue.title}</span>
      <span> {issue.endDate}</span>
      <div>{issue.description}</div>
      <div>GraphComponent: {issue.graph}</div>
    </div>
  </div>
);
