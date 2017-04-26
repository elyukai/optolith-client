import * as React from 'react';
import { RadioButtonGroup } from './RadioButtonGroup';

export const SORT_NAMES = {
	name: 'Alphabetisch',
	group: 'Nach Gruppe',
	groupname: 'Nach Gruppe',
	where: 'Nach Trageort'
};

export type SortNames = 'name' | 'group' | 'groupname' | 'where';

export interface SortOptionsProps {
	options: SortNames[];
	sort: (option: string) => void;
	sortOrder: string;
}

export function SortOptions(props: SortOptionsProps) {
	const { options, sort, sortOrder, ...other } = props;
	return (
		<RadioButtonGroup
			{...other}
			active={sortOrder}
			onClick={sort}
			array={options.map(e => ({ name: SORT_NAMES[e], value: e }))}
			/>
	);
}
