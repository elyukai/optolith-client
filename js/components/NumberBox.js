import React, { Component, PropTypes } from 'react';

export default class NumberBox extends Component {

	static propTypes = {
		current: PropTypes.number,
		max: PropTypes.number
	};

	render() {

		const { current, max } = this.props;

		return (
			<div className="number-box">
				{ current ? <span className="current">{current}</span> : null }
				{ max ? <span className="max">{max}</span> : null }
			</div>
		);
	}
}
