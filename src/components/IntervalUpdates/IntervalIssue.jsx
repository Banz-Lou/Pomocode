import React from "react";
import IntervalUpdatesChart from "../Vizualizations/IntervalUpdatesChart";

var IntervalIssue = ({ issue }) => {
  console.log("Issue:", issue);
  return (
    <main>
      <IntervalUpdatesChart
        data={[
          { type: "Plan", plan_seconds: issue.issue.plan_seconds },
          {
            type: "Active",
            prior_active: issue.prior_active,
            active: issue.active
          }
        ]}
      />
    </main>
  );
};

export default IntervalIssue;
