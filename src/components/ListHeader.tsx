import * as React from 'react';

export interface ListHeaderProps {
	children?: React.ReactNode;
}

export function ListHeader(props: ListHeaderProps) {
	const { children } = props;
	return (
		<div className="list-header">
			{children}
		</div>
	);
}
