import { DetailsGraphActions } from "../actions";

let initialState = {
  selectedGraph: "Interval",
  data: [],
  loading: false
};

export default function details(state = initialState, action) {
  switch (action.type) {
    case DetailsGraphActions.SET_GRAPH_ISSUE:
      return {
        ...state,
        selectedGraph: action.issue
      };
    case DetailsGraphActions.SET_GRAPH_INTERVAL:
      return {
        ...state,
        selectedGraph: action.interval
      };
    case DetailsGraphActions.BEGIN_FETCH_DETAILS:
      return {
        ...state,
        loading: true
      };
    case DetailsGraphActions.SUCCESS_FETCH_DETAILS:
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case DetailsGraphActions.FAIL_FETCH_DETAILS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
