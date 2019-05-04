// Create ActionCreators folder
// Separate Action Creators per js file

import axios from "axios";

import { SET_SEARCH_TERM } from "./actions";
import { IntervalsUpdatesActions } from "./actions";

export class IntervalsUpdatesActionCreators {
  static fetchIntervals() {
    return async dispatch => {
      dispatch({ type: IntervalsUpdatesActions.BEGIN_FETCH_INTERVALS });
      try {
        const intervals = [[20, 6], [57, 3], [3, 1, 70]];
        dispatch({
          type: IntervalsUpdatesActions.SUCCESS_FETCH_INTERVALS,
          intervals
        });
      } catch (error) {
        dispatch({
          type: IntervalsUpdatesActions.FAIL_FETCH_INTERVALS,
          payload: error
        });
      }
    };
  }
}

export function setSearchTerm(searchTerm) {
  return { type: SET_SEARCH_TERM, payload: searchTerm };
}
