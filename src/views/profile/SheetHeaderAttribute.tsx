import classNames from 'classnames';
import * as React from 'react';

interface SheetHeaderAttributeProps {
	id: string;
	label: string;
	value?: number | string;
}

export default (props: SheetHeaderAttributeProps) => (
	<div className={classNames('sheet-attribute', props.id)}>
		<span className="label">{props.label}</span>
		<span className="value">{props.value}</span>
	</div>
);
