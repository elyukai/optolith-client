import * as classNames from 'classnames';
import * as React from 'react';

export interface ListItemGroupProps {
	children?: React.ReactNode;
	index?: number;
	list?: string[];
	small?: boolean;
}

export function ListItemGroup(props: ListItemGroupProps) {
	const { children, index, list, small } = props;
	if (typeof index === 'number' && Array.isArray(list)) {
		return (
			<div className={classNames('group', small && 'small-info-text')}>
				{list[index - 1]}
			</div>
		);
	}
	return (
		<div className={classNames('group', small && 'small-info-text')}>
			{children}
		</div>
	);
}
