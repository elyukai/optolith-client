import * as classNames from 'classnames';
import * as React from 'react';

export interface ListItemGroupProps {
	children?: React.ReactNode;
	index?: number;
	list?: string[];
	small?: boolean;
	text?: string;
}

export function ListItemGroup(props: ListItemGroupProps) {
	const { children, index, list, small, text } = props;

	let content: React.ReactNode;

	if (typeof index === 'number' && Array.isArray(list)) {
		content = list[index - 1];
	}
	else if (typeof text === 'string') {
		content = text;
	}

	return (
		<div className={classNames('group', small && 'small-info-text')}>
			{content || children}
		</div>
	);
}
