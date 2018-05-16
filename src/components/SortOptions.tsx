import * as React from 'react';
import { sortObjects } from '../utils/FilterSortUtils';
import { translate, UIMessages } from '../utils/I18n';
import { RadioButtonGroup } from './RadioButtonGroup';

export type SortNames = 'name' | 'group' | 'groupname' | 'where' | 'cost' | 'ap' | 'ic' | 'property' | 'aspect' | 'weight';

export interface SortOptionsProps {
	locale: UIMessages;
	options: SortNames[];
	sortOrder: string;
	sort(option: string): void;
}

export function SortOptions(props: SortOptionsProps) {
	const { locale, options, sort, sortOrder, ...other } = props;

	const SORT_NAMES = {
		name: translate(locale, 'options.sortorder.alphabetically'),
		group: translate(locale, 'options.sortorder.group'),
		groupname: translate(locale, 'options.sortorder.group'),
		where: translate(locale, 'options.sortorder.location'),
		cost: translate(locale, 'options.sortorder.cost'),
		ap: translate(locale, 'options.sortorder.ap'),
		ic: translate(locale, 'options.sortorder.improvementcost'),
		property: translate(locale, 'options.sortorder.property'),
		aspect: translate(locale, 'options.sortorder.aspect'),
		weight: translate(locale, 'options.sortorder.weight'),
	};

	return (
		<RadioButtonGroup
			{...other}
			active={sortOrder}
			onClick={sort}
			array={sortObjects(options.map(e => ({ name: SORT_NAMES[e], value: e })), locale.id)}
			/>
	);
}
