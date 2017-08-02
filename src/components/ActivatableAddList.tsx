import * as React from 'react';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, Instance } from '../types/data.d';
import { getFullName } from '../utils/ActivatableUtils';
import { filterAndSort } from '../utils/FilterSortUtils';
import { ActivatableAddListItem } from './ActivatableAddListItem';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemName } from './ListItemName';
import { Scroll } from './Scroll';

type CombinedList = Array<DeactiveViewObject & { active: false } | ActiveViewObject & { active: true }>;

interface Props {
	activeList?: ActiveViewObject[];
	filterText?: string;
	groupNames?: string[];
	hideGroup?: boolean;
	list: DeactiveViewObject[];
	rating?: { [id: string]: string };
	showRating?: boolean;
	sortOrder?: string;
	addToList(args: ActivateArgs): void;
	get(id: string): Instance | undefined;
}

export function ActivatableAddList(props: Props) {
	const { activeList, addToList, filterText = '', get, groupNames, hideGroup, list, rating, showRating, sortOrder = 'name' } = props;

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

	const sortedList = filterAndSort(combinedList, filterText, sortOrder, groupNames);

	return (
		<Scroll>
			<List>
				{sortedList.map(item => {
					if (item.active === true) {
						const name = getFullName(item);
						return (
							<ListItem key={name} disabled>
								<ListItemName name={name} />
							</ListItem>
						);
					}
					return (
						<ActivatableAddListItem
							key={item.id}
							item={item}
							addToList={addToList}
							isImportant={showRating && rating && rating[item.id] === 'IMP'}
							isTypical={showRating && rating && rating[item.id] === 'TYP'}
							isUntypical={showRating && rating && rating[item.id] === 'UNTYP'}
							hideGroup={hideGroup}
							get={get}
							/>
					);
				})}
			</List>
		</Scroll>
	);
}
