import React, { Component } from 'react';
import { connect } from 'react-redux';

const data = [
	{
		nameWithOwner: 'SUPERMAN/octocat'
	},
	{
		nameWithOwner: 'Mike/octocat'
	},
	{
		nameWithOwner: 'Pomocode/Pomocode'
	}
];

//
//  - componentWillMount:
//  -- AJAX request to obtain repositories
//  -- Update state (dispatch Action)
//  ---- Repositories []

//  -- On selecting Repo
//  ---- another AJAX fetch Issues [] (dispatch action)

//  -- On selecting an Issue
//  ---- set state of selected Issue (dispatch action)
//  ------ display needed info on issue
//
//  -- On setting Calendar dates and hours
//  ---- AJAX request to save to DB
//  ------ Receive the latest Planned Issues list (dispatch action)
//

const Planner = ({ plans }) => (
	<div>
		"PLANNER"
		<div>
			<select>
				{plans.repos.map(repo => {
					return <option>{repo.nameWithOwner}</option>;
				})}
			</select>
		</div>
		<div>
			<select>
				{plans.issues.map(issue => {
					return <option>{issue.nameWithOwner}</option>;
				})}
			</select>
		</div>
		<div>
			<span>{plans.selectedIssue.title}</span>
			<div>{plans.selectedIssue.description}</div>
			<div>{plans.dates}</div>
			<div>{plans.seconds}</div>
		</div>
	</div>
);

const mapStateToProps = state => ({
	plans: state.plans
});

export default connect(mapStateToProps)(Planner);
