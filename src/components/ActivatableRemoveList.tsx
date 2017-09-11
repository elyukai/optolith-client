import * as React from 'react';
import { ActiveViewObject, DeactivateArgs, UIMessages } from '../types/data.d';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { ActivatableRemoveListItem } from './ActivatableRemoveListItem';
import { List } from './List';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

export interface ActivatableRemoveListProps {
	filterText?: string;
	groupNames?: string[];
	hideGroup?: boolean;
	list: ActiveViewObject[];
	locale: UIMessages;
	phase?: number;
	rating?: { [id: string]: string };
	showRating?: boolean;
	sortOrder?: string;
	setTier(id: string, index: number, tier: number, cost: number): void;
	removeFromList(args: DeactivateArgs): void;
}

export function ActivatableRemoveList(props: ActivatableRemoveListProps) {
	const { filterText = '', groupNames, hideGroup, list, locale, phase, rating, removeFromList, setTier, showRating, sortOrder = 'name' } = props;

	const sortedList = filterAndSortObjects(list, locale.id, filterText, sortOrder === 'group' ? [{ key: 'gr', mapToIndex: groupNames }, 'name'] : ['name']);

	return (
		<Scroll>
			{list.length === 0 ? (
				<ListPlaceholder locale={locale} />
			) : (
				<List>
					{sortedList.map(item => (
						<ActivatableRemoveListItem
							key={`${item.id}_${item.index}`}
							item={item}
							locale={locale}
							phase={phase}
							setTier={setTier}
							removeFromList={removeFromList}
							isImportant={showRating && rating && rating[item.id] === 'IMP'}
							isTypical={showRating && rating && rating[item.id] === 'TYP'}
							isUntypical={showRating && rating && rating[item.id] === 'UNTYP'}
							hideGroup={hideGroup}
							/>
					))}
				</List>
			)}
		</Scroll>
	);
}
