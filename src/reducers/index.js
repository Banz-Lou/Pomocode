import { combineReducers } from "redux";
import { SET_SEARCH_TERM } from "../actions";
import searchTerm from "./example.js";
import activeIssues from "./activeIssues";
import details from "./details";
import historical from "./historical";
import intervals from "./intervals";
import plans from "./plans";

const rootReducer = combineReducers({
  searchTerm,
  activeIssues,
  details,
  historical,
  intervals,
  plans
});

export default rootReducer;

/*
state: 
	intervals: [{}, {}, ...]  //top 5
	plans: {
		repos: [{}, {}, ...] //load ALL repos
		issues: [{}, {}, ...] //pre-load ALL issues
		selectedRepo: {} OR repo.id
		selectedIssue: {} OR issue.id
		seconds: integer
		dates: date range
	}
	activeIssues: [{}, {}, ...] //list of active issues; NOTE: COMPLETED button?
	historical: [{}, {}, ...]
	details: {
		stuffMcTings: // which one to show?
		filesIntervals: [{}, {}, ...]
		issuesIntervals: [{}, {}, ...]
	}
*/

// const DEFAULT_STATE = {
// 	searchTerm: ''
// };

// const setSearchTerm = (state, action) =>
// 	Object.assign({}, state, { searchTerm: action.payload });

// const rootReducer = (state = DEFAULT_STATE, action) => {
// 	switch (action.type) {
// 		case SET_SEARCH_TERM:
// 			return setSearchTerm(state, action);
// 		default:
// 			return state;
// 	}
// };
