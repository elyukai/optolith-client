import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
}

export default class Box extends Component<Props, any> {

	static propTypes = {
		className: PropTypes.string
	};

	render() {

		let { children, className, ...other } = this.props;

		className = classNames( 'box', className );

		return (
			<div {...other} className={className}>
				{children}
			</div>
		);
	}
}
