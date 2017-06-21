import * as React from 'react';
import { translate } from '../utils/I18n';
import { sort as sortList } from '../utils/FilterSortUtils';
import { RadioButtonGroup } from './RadioButtonGroup';

export type SortNames = 'name' | 'group' | 'groupname' | 'where' | 'cost' | 'ap' | 'ic' | 'property' | 'aspect';

export interface SortOptionsProps {
	options: SortNames[];
	sort: (option: string) => void;
	sortOrder: string;
}

export function SortOptions(props: SortOptionsProps) {
	const { options, sort, sortOrder, ...other } = props;

	const SORT_NAMES = {
		name: translate('options.sortorder.alphabetically'),
		group: translate('options.sortorder.group'),
		groupname: translate('options.sortorder.group'),
		where: translate('options.sortorder.location'),
		cost: translate('options.sortorder.cost'),
		ap: translate('options.sortorder.ap'),
		ic: translate('options.sortorder.improvementcost'),
		property: translate('options.sortorder.property'),
		aspect: translate('options.sortorder.aspect')
	};

	return (
		<RadioButtonGroup
			{...other}
			active={sortOrder}
			onClick={sort}
			array={sortList(options.map(e => ({ name: SORT_NAMES[e], value: e })))}
			/>
	);
}
