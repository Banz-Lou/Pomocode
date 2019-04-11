// intervals: [{}, {}, ...]  //top 5
import { SET_INTERVALS } from '../actions';

let testData = [[6, 6], [3, 3], [1, 2, 3]];

// let rawQuery = [
// 	{TrueIntervalNum: 1, },
// 	{},
// 	{}
// ]

// let data = [
// 	{Issue: 1, plan: 50 },
// 	{Issue: 1,Time: 25, IntervalTime: 30},
// 	{Issue: 2, plan: 60},
// 	{Issue: 2, Time: 30, IntervalTime: 25}
// ]

export default function intervals(state = testData, action) {
	if (action.type === SET_INTERVALS) {
		return action.payload;
	}
	return state;
}
