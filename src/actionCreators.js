// Create ActionCreators folder
// Separate Action Creators per js file

import axios from "axios";

import { SET_SEARCH_TERM } from "./actions";
import { IntervalsUpdatesActions } from "./actions";

export function fetchIntervals() {
  return async dispatch => {
    dispatch({ type: IntervalsUpdatesActions.BEGIN_FETCH_INTERVALS });
    try {
      const intervals = await axios.get("/");
      dispatch({
        type: IntervalsUpdatesActions.SUCCESS_FETCH_INTERVALS,
        payload: intervals
      });
    } catch (error) {
      dispatch({
        type: IntervalsUpdatesActions.FAIL_FETCH_INTERVALS,
        payload: error
      });
    }
  };
}

export function setSearchTerm(searchTerm) {
  return { type: SET_SEARCH_TERM, payload: searchTerm };
}
