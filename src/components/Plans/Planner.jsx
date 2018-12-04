import React, { Component } from 'react';

const data = [
  {
    nameWithOwner: 'Fred/octocat'
  },
  {
    nameWithOwner: 'Mike/octocat'
  },
  {
    nameWithOwner: 'Pomocode/Pomocode'
  }
];

//
//  - componentWillMount:
//  -- AJAX request to obtain repositories
//  -- Update state (dispatch Action)
//  ---- Repositories []

//  -- On selecting Repo
//  ---- another AJAX fetch Issues [] (dispatch action)

//  -- On selecting an Issue
//  ---- set state of selected Issue (dispatch action)
//  ------ display needed info on issue
//
//  -- On setting Calendar dates and hours
//  ---- AJAX request to save to DB
//  ------ Receive the latest Planned Issues list (dispatch action)
//

class Planner extends Component {
  render() {
    return (
      <div>
        "PLANNER"
        <div>
          <select>
            {data.map(repo => {
              return <option>{repo.nameWithOwner}</option>;
            })}
          </select>
        </div>
        <div>
          <select>
            {data.map(repo => {
              return <option>{repo.nameWithOwner}</option>;
            })}
          </select>
        </div>
        <div>
          <span>SelectedIssueName</span>
          <div>Description</div>
          <div>Calendar</div>
          <div>Hours</div>
        </div>
      </div>
    );
  }
}

export default Planner;
