import * as React from 'react';
import Box from './Box';
import classNames from 'classnames';

interface Props {
	className?: string;
	label: string;
	value?: string | number;
}

export default class LabelBox extends React.Component<Props, undefined> {
	render() {
		const { className, children, label, value } = this.props;
		return (
			<div className={classNames('labelbox', className)}>
				<Box>{value ? value : children}</Box>
				<label>{label}</label>
			</div>
		);
	}
}
