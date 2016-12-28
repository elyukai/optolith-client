import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class VerticalList extends Component {

	static propTypes = {
		className: PropTypes.string
	}

	render() {

		let { children, className, ...other } = this.props;

		className = classNames(className, 'vertical-list');
		
		return (
			<div {...other} className={className}>
				{children}
			</div>
		);
	}
}
