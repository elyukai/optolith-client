import { Component, PropTypes } from 'react';
import * as React from 'react';

interface Props {
	current?: number;
	max: number;
}

export default class NumberBox extends Component<Props, any> {

	static propTypes = {
		current: PropTypes.number,
		max: PropTypes.number
	};

	render() {

		const { current, max } = this.props;

		return (
			<div className="number-box">
				{ current || current === 0 ? <span className="current">{current}</span> : null }
				{ max ? <span className="max">{max}</span> : null }
			</div>
		);
	}
}
