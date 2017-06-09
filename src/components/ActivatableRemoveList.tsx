import * as React from 'react';
import { ActiveViewObject, DeactivateArgs } from '../types/data.d';
import { filterAndSort } from '../utils/ListUtils';
import { ActivatableRemoveListItem } from './ActivatableRemoveListItem';
import { List } from './List';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

interface Props {
	filterText?: string;
	groupNames?: string[];
	hideGroup?: boolean;
	list: ActiveViewObject[];
	phase?: number;
	rating?: { [id: string]: string };
	showRating?: boolean;
	sortOrder?: string;
	setTier(id: string, index: number, tier: number, cost: number): void;
	removeFromList(args: DeactivateArgs): void;
}

export function ActivatableRemoveList(props: Props) {
	const { filterText = '', groupNames, hideGroup, list, phase, rating, removeFromList, setTier, showRating, sortOrder = 'name' } = props;

	const sortedList = filterAndSort(list, filterText, sortOrder, groupNames);

	return (
		<Scroll>
			{list.length === 0 ? (
				<ListPlaceholder />
			) : (
				<List>
					{sortedList.map(item => (
						<ActivatableRemoveListItem
							key={`${item.id}_${item.index}`}
							item={item}
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
