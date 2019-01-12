// historical: [{}, {}, ...]
import { SET_HISTORICAL } from '../actions';
export default function historical(state = [], action) {
	if (action.type === SET_HISTORICAL) {
		return action.payload;
	}
	return state;
}
