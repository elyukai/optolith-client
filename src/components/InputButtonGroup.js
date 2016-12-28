import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class InputButtonGroup extends Component {

	static propTypes = {
		className: PropTypes.any
	};

	render() {

		let { className, ...other } = this.props;

		className = classNames(className, 'btn-group');

		return (
			<div className={className} {...other}>
				{this.props.children}
			</div>
		);
	}
}
