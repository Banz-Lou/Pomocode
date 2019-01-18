// activeIssues: [{}, {}, ...] //list of active issues; NOTE: COMPLETED button?
const testData = [
  {
    nameWithOwner: 'Fred/octocat',
    title: 'test1',
    endDate: 'date',
    description: 'description'
  },
  {
    nameWithOwner: 'Mike/octocat',
    title: 'test1',
    endDate: 'date',
    description: 'description'
  },
  {
    nameWithOwner: 'Frike/octocat',
    title: 'test1',
    endDate: 'date',
    description: 'description'
  }
];

import { SET_ACTIVE_ISSUES } from '../actions';
export default function activeIssues(state = testData, action) {
  if (action.type === SET_ACTIVE_ISSUES) {
    return action.payload;
  }
  return state;
}
