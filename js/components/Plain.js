import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Plain extends Component {

	static propTypes = {
		className: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		value: PropTypes.any
	};

	render() {

		const className = classNames( 'plain', this.props.className );

		return (
			<div className={className}>
				<div className="label">{this.props.label}</div>
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}

export default Plain;
