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
	isRemovingEnabled: boolean;
	rating?: { [id: string]: string };
	showRating?: boolean;
	sortOrder?: string;
	setTier(id: string, index: number, tier: number): void;
	removeFromList(args: DeactivateArgs): void;
}

export function ActivatableRemoveList(props: ActivatableRemoveListProps) {
	const { filterText = '', groupNames, list, locale, rating, showRating, sortOrder = 'name' } = props;

	const sortedList = filterAndSortObjects(list, locale.id, filterText, sortOrder === 'groupname' ? [{ key: 'gr', mapToIndex: groupNames }, 'name'] : ['name']);

	return (
		<Scroll>
			{list.length === 0 ? (
				<ListPlaceholder locale={locale} />
			) : (
				<List>
					{sortedList.map(item => (
						<ActivatableRemoveListItem
							{...props}
							key={`${item.id}_${item.index}`}
							item={item}
							isImportant={showRating && rating && rating[item.id] === 'IMP'}
							isTypical={showRating && rating && rating[item.id] === 'TYP'}
							isUntypical={showRating && rating && rating[item.id] === 'UNTYP'}
							/>
					))}
				</List>
			)}
		</Scroll>
	);
}
