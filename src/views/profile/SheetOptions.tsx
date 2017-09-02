import * as React from 'react';

export interface SheetOptionsProps {
	children?: React.ReactNode;
}

export function SheetOptions(props: SheetOptionsProps) {
	const { children } = props;
	return (
		<div className="sheet-options">
			{children}
		</div>
	);
}
