// intervals: [{}, {}, ...]  //top 5
import { SET_INTERVALS } from '../actions';
export default function intervals(state = [], action) {
	if (action.type === SET_INTERVALS) {
		return action.payload;
	}
	return state;
}
