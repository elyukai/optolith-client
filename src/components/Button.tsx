import * as classNames from 'classnames';
import * as React from 'react';

export interface ButtonProps {
	autoWidth?: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	flat?: boolean;
	fullWidth?: boolean;
	primary?: boolean;
	round?: boolean;
	onClick?(): void;
	[id: string]: any;
}

export function Button(props: ButtonProps) {
	const { autoWidth, primary, flat, fullWidth, disabled, round, children, onClick, ...other } = props;
	let { className } = props;

	className = classNames(className, {
		'btn': true,
		'btn-round': round,
		'btn-text': !round,
		'btn-primary': primary,
		'btn-flat': flat,
		'autoWidth': autoWidth,
		'fullWidth': fullWidth,
		'disabled': disabled
	});

	return (
		<div {...other} className={className} onClick={disabled ? undefined : onClick}>
			{children}
		</div>
	);
}
