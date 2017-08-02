import * as React from 'react';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, Instance } from '../../types/data.d';

interface Props {
	activeList?: ActiveViewObject[];
	filterText: string;
	list: DeactiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
	get(id: string): Instance | undefined;
	addToList(args: ActivateArgs): void;
}

export function DeactiveList(props: Props) {
	const { activeList, addToList, filterText, get, list, rating, showRating } = props;
	return (
		<ActivatableAddList
			activeList={activeList}
			filterText={filterText}
			list={list}
			addToList={addToList}
			rating={rating}
			showRating={showRating}
			hideGroup
			get={get}
			/>
	);
}
