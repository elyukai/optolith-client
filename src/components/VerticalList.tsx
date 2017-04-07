import classNames from 'classnames';
import * as React from 'react';

interface Props {
	className?: string;
	children?: React.ReactNode;
}

export default function VerticalList(props: Props) {
	const { children, className, ...other } = props;
	return (
		<div {...other} className={classNames(className, 'vertical-list')}>
			{children}
		</div>
	);
}
