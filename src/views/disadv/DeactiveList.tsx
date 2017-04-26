import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActiveViewObject, DeactiveViewObject } from '../../types/data.d';

interface Props {
	activeList?: ActiveViewObject[];
	filterText: string;
	list: DeactiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
}

export function DeactiveList(props: Props) {
	const { activeList, filterText, list, rating, showRating } = props;
	return (
		<ActivatableAddList
			activeList={activeList}
			filterText={filterText}
			list={list}
			addToList={DisAdvActions.addToList}
			rating={rating}
			showRating={showRating}
			hideGroup
			/>
	);
}
