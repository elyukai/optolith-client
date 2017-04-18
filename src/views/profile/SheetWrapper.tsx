import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function SheetWrapper(props: Props) {
	const { children } = props;
	return (
		<div className="sheet-wrapper">
			{children}
		</div>
	);
}
