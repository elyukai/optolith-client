import * as React from 'react';
import classNames from 'classnames';

interface SheetHeaderAttributeProps {
	id: string;
	label: string;
	value?: number | string;
}

export default (props: SheetHeaderAttributeProps) => {
	const { id, label, value } = props;
	const className = classNames('sheet-attribute', id);

	return (
		<div className={className}>
			<span className="label">{label}</span>
			<span className="value">{value}</span>
		</div>
	);
}
