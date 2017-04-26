import classNames from 'classnames';
import * as React from 'react';

export interface PlainProps {
	className: string;
	label: string;
	value?: string | number;
}

export function Plain(props: PlainProps) {
	const { className, label, value } = props;
	return (
		<div className={classNames('plain', className)}>
			<div className="label">{label}</div>
			<div className="value">{value}</div>
		</div>
	);
}
