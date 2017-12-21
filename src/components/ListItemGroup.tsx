import * as classNames from 'classnames';
import * as React from 'react';

export interface ListItemGroupProps {
	index?: number;
	list?: string[];
	small?: boolean;
	text?: string;
}

export function ListItemGroup(props: ListItemGroupProps) {
	const { index, list, small, text } = props;
	if (typeof index === 'number' && Array.isArray(list)) {
		return (
			<div className={classNames('group', small && 'small-info-text')}>
				{list[index - 1]}
			</div>
		);
	}
	return (
		<div className={classNames('group', small && 'small-info-text')}>
			{text}
		</div>
	);
}
