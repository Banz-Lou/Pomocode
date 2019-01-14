// intervals: [{}, {}, ...]  //top 5
import { SET_INTERVALS } from '../actions';

let testData = [[6, 6], [3, 3], [1, 2, 3], [1]];

export default function intervals(state = testData, action) {
	if (action.type === SET_INTERVALS) {
		return action.payload;
	}
	return state;
}
