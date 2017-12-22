import * as React from 'react';
import { ActiveViewObject, DeactivateArgs, UIMessages } from '../types/data.d';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { ActivatableRemoveListItem } from './ActivatableRemoveListItem';
import { List } from './List';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

export interface ActivatableRemoveListProps {
	filterText: string;
	hideGroup?: boolean;
	list: ActiveViewObject[];
	locale: UIMessages;
	isRemovingEnabled: boolean;
	rating?: { [id: string]: string };
	showRating?: boolean;
	setTier(id: string, index: number, tier: number): void;
	removeFromList(args: DeactivateArgs): void;
	selectForInfo?(id: string): void;
}

export function ActivatableRemoveList(props: ActivatableRemoveListProps) {
	const { filterText, list, locale, rating, showRating } = props;

	if (list.length === 0) {
		return <ListPlaceholder locale={locale} noResults={filterText.length > 0} type="specialAbilities" />;
	}

	return (
		<Scroll>
			<List>
				{list.map(item => (
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
		</Scroll>
	);
}
