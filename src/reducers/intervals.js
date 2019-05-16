// intervals: [{}, {}, ...]  //top 5
import { SET_INTERVALS } from "../actions";
import { IntervalsUpdatesActions } from "../actions";

// initial state obj
var emptyObj = {
  id: 0,
  user_name: "",
  daily_interval: 0,
  true_interval_num: 0,
  prior_active: 0,
  active: 0,
  total_active: 0,
  prior_idle: 0,
  idle: 0,
  total_idle: 0,
  word_count: 0,
  createdAt: "",
  updatedAt: "",
  intervalId: 0,
  issueId: 0,
  issue: {
    plan_seconds: 0,
    title: ""
  }
};

let testData = { data: [[emptyObj], [emptyObj], [emptyObj]], loading: false };

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
