import React from "react";
import { connect } from "react-redux";
import IntervalIssue from "./IntervalIssue";
import { DetailsActionCreators } from "../../actionCreators";

class Interval extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setGraph({ interval: event.target.value });
  }

  render() {
    const { item } = this.props;
    return (
      <div>
        <button
          onClick={this.handleClick}
          value={item[0].true_interval_num}
        >{`Interval: ${item[0].true_interval_num}`}</button>
        {item.map(issue => (
          <IntervalIssue issue={issue} />
        ))}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setGraph: interval => {
    dispatch(DetailsActionCreators.setGraph(interval));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(Interval);
