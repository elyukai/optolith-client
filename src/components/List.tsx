import * as React from 'react';

export interface ListProps {
	children?: React.ReactNode;
}

export function List(props: ListProps) {
	const { children } = props;
	return (
		<ul className="list-wrapper">
			{children}
		</ul>
	);
}
