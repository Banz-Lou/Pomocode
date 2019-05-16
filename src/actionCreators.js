// Create ActionCreators folder
// Separate Action Creators per js file

import { IntervalsUpdatesActions, DetailsGraphActions } from "./actions";
import database from "./utils/database";

export class IntervalsUpdatesActionCreators {
  static fetchIntervals() {
    return async dispatch => {
      dispatch({ type: IntervalsUpdatesActions.BEGIN_FETCH_INTERVALS });
      try {
        const intervals = await database.fetchIntervals();
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

export class DetailsActionCreators {
  static setGraph(selected) {
    return async dispatch => {
      dispatch({ type: DetailsGraphActions.BEGIN_FETCH_DETAILS });
      try {
        const data = await database.fetchDetails(selected);
        if (selected.issue) {
          dispatch({
            type: DetailsGraphActions.SET_GRAPH_ISSUE,
            issue: selected
          });
        } else {
          dispatch({
            type: DetailsGraphActions.SET_GRAPH_INTERVAL,
            interval: selected
          });
        }
        dispatch({ type: DetailsGraphActions.SUCCESS_FETCH_DETAILS, data });
      } catch (error) {
        dispatch({
          type: DetailsGraphActions.FAIL_FETCH_DETAILS,
          payload: error
        });
      }
    };
  }
}
