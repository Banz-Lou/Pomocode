import React from 'react';
import { connect } from 'react-redux';
import { Active } from './Active';

const ActiveIssues = ({ activeIssues }) => {
  return (
    <div>
      "ActiveIssues"
      {activeIssues.map(issue => {
        return <Active issue={issue} />;
      })}
    </div>
  );
};

const mapStateToProps = state => ({
  activeIssues: state.activeIssues
});

export default connect(mapStateToProps)(ActiveIssues);
