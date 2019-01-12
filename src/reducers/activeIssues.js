// activeIssues: [{}, {}, ...] //list of active issues; NOTE: COMPLETED button?
import { SET_ACTIVE_ISSUES } from '../actions';
export default function activeIssues(state = [], action) {
	if (action.type === SET_ACTIVE_ISSUES) {
		return action.payload;
	}
	return state;
}
