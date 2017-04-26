import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { ActiveViewObject } from '../../types/data.d';

interface Props {
	filterText: string;
	list: ActiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
}

export function ActiveList(props: Props) {
	const { filterText, list, rating, showRating } = props;
	return (
		<ActivatableRemoveList
			filterText={filterText}
			list={list}
			setTier={DisAdvActions.setTier}
			removeFromList={DisAdvActions.removeFromList}
			rating={rating}
			showRating={showRating}
			hideGroup
			/>
	);
}
