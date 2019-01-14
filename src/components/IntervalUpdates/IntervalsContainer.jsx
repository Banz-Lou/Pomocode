import React from 'react';
import { connect } from 'react-redux';
import Interval from './Interval';

var IntervalsContainer = ({ intervals }) => {
	return (
		<div>
			{intervals.map(item => (
				<Interval item={item} />
			))}
		</div>
	);
};

const mapStateToProps = state => ({
	intervals: state.intervals
});
export default connect(mapStateToProps)(IntervalsContainer);
