// intervals: [{}, {}, ...]  //top 5
import { SET_INTERVALS } from "../actions";
import { IntervalsUpdatesActions } from "../actions";

var emptyObj = { issue: {} };

let testData = { data: [[emptyObj], [emptyObj], [emptyObj]], loading: false };

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
  switch (action.type) {
    case IntervalsUpdatesActions.BEGIN_FETCH_INTERVALS:
      return {
        ...state,
        loading: true
      };
    case IntervalsUpdatesActions.SUCCESS_FETCH_INTERVALS:
      return {
        ...state,
        data: action.intervals,
        loading: false
      };
    case IntervalsUpdatesActions.FAIL_FETCH_INTERVALS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
