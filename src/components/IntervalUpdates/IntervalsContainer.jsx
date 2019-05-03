import React from 'react';
import { connect } from 'react-redux';
import Interval from './Interval';

class IntervalsContainer extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		this.props.fetchIntervals();
	}

	return (
		<div id="intervals" className="inner-sub-container">
			{this.props.intervals.map(item => (
				<Interval item={item} />
			))}
		</div>
	);
};

const mapStateToProps = state => ({
	intervals: state.intervals
});

const mapDispatchToProps = dispatch => ({
		fetchIntervals: () => {
			dispatch(fetchIntervals())
		}
});

export default connect(mapStateToProps, mapDispatchToProps)(IntervalsContainer);
