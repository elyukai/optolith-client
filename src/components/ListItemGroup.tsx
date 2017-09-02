import * as React from 'react';

export interface ListItemGroupProps {
	children?: React.ReactNode;
	index?: number;
	list?: string[];
}

export function ListItemGroup(props: ListItemGroupProps) {
	const { children, index, list } = props;
	if (typeof index === 'number' && Array.isArray(list)) {
		return (
			<div className="group">
				{list[index - 1]}
			</div>
		);
	}
	return (
		<div className="group">
			{children}
		</div>
	);
}
