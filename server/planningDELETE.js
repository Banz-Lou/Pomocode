var originaData = [
  { interval: 1, issue: 1, prior: 1, active: 1, issue: { plan: 1 } },
  { inteval: 1, issue: 2 },
  { interval: 2, issue: 1 },
  { interval: 2, issue: 2 },
  { interval: 3, issue: 1 }
];

var finalForm = [
  [{ interval: 1, issue: 1 }, { inteval: 1, issue: 2 }],
  [{ interval: 2, issue: 1 }, { interval: 2, issue: 2 }],
  [{ interval: 3, issue: 1 }]
];

var powerUp = originalData => {
  let hashObj = {};
  originaData.forEach(issue => {
    if (hashObj[issue.interval]) {
      hashObj[issue.interval].push(issue);
    } else {
      hashObj[issue.interval] = [issue];
    }
  });
  return Object.values(hashObj);
};

var secondMap = [
  { interval: 1, issue: 1, prior: 1, active: 1, issue: { plan: 1 } },
  { interval: 1, issue: 2, prior: 1, active: 1, issue: { plan: 1 } }
];

secondMap.map(issue => {
  return (
    <IntervalUpdatesChart
      data={[
        { type: "Plan", plan_seconds: issue.plan_seconds },
        {
          type: "Active",
          prior_active: issue.prior_active,
          active: issue.active
        }
      ]}
    />
  );
});
