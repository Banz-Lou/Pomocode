import React from "react";
import { connect } from "react-redux";
import IntervalUpdatesChart from "../Vizualizations/IntervalUpdatesChart";
import { DetailsActionCreators } from "../../actionCreators";

class IntervalIssue extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.setGraph({ issue: e.target.value });
  }

  render() {
    var { issue } = this.props;
    return (
      <main>
        <div>
          <button onClick={this.handleClick} value={issue.issueId}>
            {issue.issue.title}
          </button>
        </div>
        <IntervalUpdatesChart
          data={[
            { type: "Plan", plan_seconds: issue.issue.plan_seconds },
            {
              type: "Active",
              prior_active: issue.prior_active,
              active: issue.active
            }
          ]}
        />
      </main>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setGraph: issue => {
    dispatch(DetailsActionCreators.setGraph(issue));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(IntervalIssue);
