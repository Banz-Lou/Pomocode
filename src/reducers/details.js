// details: {
//   stuffMcTings: // which one to show?
//   filesIntervals: [{}, {}, ...]
//   issuesIntervals: [{}, {}, ...]
// }}
import { SET_DETAILS_INTERVAL, SET_DETAILS_ISSUE } from '../actions';
export default function details(state = [], action) {
	switch (action.type) {
		case SET_DETAILS_INTERVAL:
			return state;
		case SET_DETAILS_ISSUE:
			return state;
		default:
			return state;
	}
}
