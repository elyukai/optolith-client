import * as React from 'react';
import { sortObjects } from '../utils/FilterSortUtils';
import { _translate, UIMessages } from '../utils/I18n';
import { RadioButtonGroup } from './RadioButtonGroup';

export type SortNames = 'name' | 'group' | 'groupname' | 'where' | 'cost' | 'ap' | 'ic' | 'property' | 'aspect';

export interface SortOptionsProps {
	locale: UIMessages;
	options: SortNames[];
	sortOrder: string;
	sort(option: string): void;
}

export function SortOptions(props: SortOptionsProps) {
	const { locale, options, sort, sortOrder, ...other } = props;

	const SORT_NAMES = {
		name: _translate(locale, 'options.sortorder.alphabetically'),
		group: _translate(locale, 'options.sortorder.group'),
		groupname: _translate(locale, 'options.sortorder.group'),
		where: _translate(locale, 'options.sortorder.location'),
		cost: _translate(locale, 'options.sortorder.cost'),
		ap: _translate(locale, 'options.sortorder.ap'),
		ic: _translate(locale, 'options.sortorder.improvementcost'),
		property: _translate(locale, 'options.sortorder.property'),
		aspect: _translate(locale, 'options.sortorder.aspect')
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
