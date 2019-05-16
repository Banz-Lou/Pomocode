import React from "react";
import IntervalIssue from "./IntervalIssue";

class Interval extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { item } = this.props;
    return (
      <div>
        {item[0].true_interval_num}
        {item.map(issue => (
          <IntervalIssue issue={issue} />
        ))}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setGraph: blah => {
    dispatch(DetailsActionCreators.setGraph(blah));
  }
});

export default Interval;
