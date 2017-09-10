import * as classNames from 'classnames';
import * as React from 'react';
import { Textfit } from 'react-textfit';

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
			<div className="value">
				<Textfit max={13} min={8} mode="single">
					{value}
				</Textfit>
			</div>
		</div>
	);
}
