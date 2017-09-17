import * as React from 'react';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, Instance, UIMessages } from '../types/data.d';
import { getFullName } from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { ActivatableAddListItemContainer } from './ActivatableAddListItem';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemName } from './ListItemName';
import { Scroll } from './Scroll';

type CombinedList = Array<DeactiveViewObject & { active: false } | ActiveViewObject & { active: true }>;

export interface ActivatableAddListProps {
	activeList?: ActiveViewObject[];
	filterText?: string;
	groupNames?: string[];
	hideGroup?: boolean;
	list: DeactiveViewObject[];
	locale: UIMessages;
	rating?: { [id: string]: string };
	showRating?: boolean;
	sortOrder?: string;
	addToList(args: ActivateArgs): void;
	get(id: string): Instance | undefined;
}

export function ActivatableAddList(props: ActivatableAddListProps) {
	const { activeList, filterText = '', groupNames, list, locale, rating, showRating, sortOrder = 'name' } = props;

	const combinedList: CombinedList = list.map<DeactiveViewObject & { active: false }>(e => {
		return {
			...e,
			active: false
		};
	});

	if (Array.isArray(activeList)) {
		combinedList.push(...activeList.map<ActiveViewObject & { active: true }>(e => {
			return {
				...e,
				active: true
			};
		}));
	}

	const sortedList = filterAndSortObjects(combinedList, locale.id, filterText, sortOrder === 'groupname' ? [{ key: 'gr', mapToIndex: groupNames }, 'name'] : ['name']);

	return (
		<Scroll>
			<List>
				{sortedList.map(item => {
					if (item.active === true) {
						const name = getFullName(item);
						return (
							<ListItem key={`${item.id}_${item.index}`} disabled>
								<ListItemName name={name} />
							</ListItem>
						);
					}
					return (
						<ActivatableAddListItemContainer
							{...props}
							key={item.id}
							item={item}
							isImportant={showRating && rating && rating[item.id] === 'IMP'}
							isTypical={showRating && rating && rating[item.id] === 'TYP'}
							isUntypical={showRating && rating && rating[item.id] === 'UNTYP'}
							/>
					);
				})}
			</List>
		</Scroll>
	);
}
