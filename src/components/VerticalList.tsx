import classNames from 'classnames';
import * as React from 'react';

export interface VerticalListProps {
	className?: string;
	children?: React.ReactNode;
}

export function VerticalList(props: VerticalListProps) {
	const { children, className, ...other } = props;
	return (
		<div {...other} className={classNames(className, 'vertical-list')}>
			{children}
		</div>
	);
}
