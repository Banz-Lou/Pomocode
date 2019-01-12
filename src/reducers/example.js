export default function searchTerm(state = '', action) {
	if (action.type === SET_SEARCH_TERM) {
		return action.payload;
	}
	return state;
}
