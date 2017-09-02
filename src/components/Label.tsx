import * as classNames from 'classnames';
import * as React from 'react';

export interface LabelProps {
	className?: string;
	disabled?: boolean;
	text?: string;
}

export function Label(props: LabelProps) {
	const { className, disabled, text, ...other } = props;
	return (
		<label {...other} className={classNames(className, disabled && 'disabled')}>{text}</label>
	);
}
