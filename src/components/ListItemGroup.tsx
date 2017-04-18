import * as React from 'react';

interface Props {
	children?: React.ReactNode;
	index?: number;
	list?: string[];
}

export default function ListItemGroup(props: Props) {
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
