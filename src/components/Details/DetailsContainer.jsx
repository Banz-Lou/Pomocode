import React from "react";
import { connect } from "react-redux";
import { DetailsGraph } from "./DetailsGraph";
import { DetailsStats } from "./DetailsStats";

class DetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.renderGraph = this.renderGraph.bind(this);
  }

  renderGraph() {
    if (this.props.selectedGraph === "Interval") {
      return <div>Interval</div>;
    } else {
      return <div>Issue</div>;
    }
  }

  render() {
    return (
      <div id="details" className="inner-sub-container">
        {this.renderGraph()}
        <DetailsStats />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedGraph: state.details.selectedGraph
});

export default connect(mapStateToProps)(DetailsContainer);
