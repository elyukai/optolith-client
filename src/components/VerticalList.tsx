import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
}

export default class VerticalList extends Component<Props, {}> {

	static propTypes = {
		className: PropTypes.string
	};

	render() {

		const { children, className, ...other } = this.props;

		return (
			<div {...other} className={classNames(className, 'vertical-list')}>
				{children}
			</div>
		);
	}
}
