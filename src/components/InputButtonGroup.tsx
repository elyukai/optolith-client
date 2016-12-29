import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
}

export default class InputButtonGroup extends Component<Props, any> {

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
