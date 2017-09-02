import * as React from 'react';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { ActiveViewObject, DeactivateArgs } from '../../types/data.d';

interface Props {
	filterText: string;
	list: ActiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number, cost: number): void;
}

export function ActiveList(props: Props) {
	const { filterText, list, rating, removeFromList, setTier, showRating } = props;
	return (
		<ActivatableRemoveList
			filterText={filterText}
			list={list}
			setTier={setTier}
			removeFromList={removeFromList}
			rating={rating}
			showRating={showRating}
			hideGroup
			/>
	);
}
