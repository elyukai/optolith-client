import * as React from 'react';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, Instance, UIMessages } from '../../types/data.d';

export interface DeactiveListProps {
	activeList?: ActiveViewObject[];
	filterText: string;
	list: DeactiveViewObject[];
	locale: UIMessages;
	rating: { [id: string]: string };
	showRating: boolean;
	get(id: string): Instance | undefined;
	addToList(args: ActivateArgs): void;
}

export function DeactiveList(props: DeactiveListProps) {
	return (
		<ActivatableAddList
			{...props}
			hideGroup
			/>
	);
}
