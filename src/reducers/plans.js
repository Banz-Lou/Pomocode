// plans: {
//   repos: [{}, {}, ...] //load ALL repos
//   issues: [{}, {}, ...] //pre-load ALL issues
//   selectedIssue: {} OR issue.id
//   seconds: integer
//   dates: date range
// }
import {
	SET_PLANS_REPOS,
	SET_PLANS_ISSUES,
	SELECT_PLANS_REPO,
	SELECT_PLANS_ISSUE,
	SET_PLANS_TIME,
	SET_PLANS_DATE
} from '../actions';

let testData = {
	repos: [
		{
			nameWithOwner: 'SUPERMAN/octocat'
		},
		{
			nameWithOwner: 'Mike/octocat'
		},
		{
			nameWithOwner: 'Pomocode/Pomocode'
		}
	],
	issues: [
		{
			nameWithOwner: 'issue1'
		},
		{
			nameWithOwner: 'issue2'
		},
		{
			nameWithOwner: 'issue3'
		}
	],
	selectedIssue: { title: 'Title', description: 'description' },
	seconds: 0,
	dates: 0
};

export default function plans(state = testData, action) {
	switch (action.type) {
		case SET_PLANS_REPOS:
			return state;
		case SET_PLANS_ISSUES:
			return state;
		case SELECT_PLANS_REPO:
			return state;
		case SELECT_PLANS_ISSUE:
			return state;
		case SET_PLANS_TIME:
			return state;
		case SET_PLANS_DATE:
			return state;
		default:
			return state;
	}
}
