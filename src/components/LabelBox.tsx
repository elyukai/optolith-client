import { Component, PropTypes } from 'react';
import * as React from 'react';
import Box from './Box';
import classNames from 'classnames';

interface Props {
	className?: string;
	label: string;
	value?: string | number;
}

export default class LabelBox extends Component<Props, any> {

	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired,
		value: PropTypes.any
	};

	render() {

		const { children, label, value } = this.props;

		const className = classNames( 'labelbox', this.props.className );

		return (
			<div className={className}>
				<Box>{value ? value : children}</Box>
				<label>{label}</label>
			</div>
		);
	}
}
