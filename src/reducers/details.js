// details: {
//   stuffMcTings: // which one to show?
//   filesIntervals: [{}, {}, ...]
//   issuesIntervals: [{}, {}, ...]
// }}
import {
  SET_DETAILS_INTERVAL,
  SET_DETAILS_ISSUE,
  SET_GRAPH_ISSUE
} from "../actions";

const initialState = {
  selectedGraph: "Interval"
};

export default function details(state = initialState, action) {
  switch (action.type) {
    case SET_GRAPH_ISSUE:
      return {
        ...state,
        selectedGraph: action.issue
      };
    case SET_DETAILS_ISSUE:
      return state;
    default:
      return state;
  }
}
