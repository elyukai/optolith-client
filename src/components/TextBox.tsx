import classNames from 'classnames';
import * as React from 'react';

export interface TextBoxProps {
	children?: React.ReactNode;
	className?: string;
	label: string;
	value?: string | number;
}

export function TextBox(props: TextBoxProps) {
		const { children, className, label, value } = props;
		return (
			<div className={classNames('textbox', className)}>
				<h3>{label}</h3>
				{value ? <div>{value}</div> : children}
			</div>
		);
}
