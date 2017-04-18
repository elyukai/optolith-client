import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function SheetOptions(props: Props) {
	const { children } = props;
	return (
		<div className="sheet-options">
			{children}
		</div>
	);
}
