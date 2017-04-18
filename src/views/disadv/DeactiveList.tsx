import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import ActivatableAddList from '../../components/ActivatableAddList';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemName from '../../components/ListItemName';
import Scroll from '../../components/Scroll';
import { getFullName } from '../../utils/ActivatableUtils';
import { sort } from '../../utils/ListUtils';

type CombinedList = Array<DeactiveViewObject & { active: false } | ActiveViewObject & { active: true }>;

interface Props {
	activeList?: ActiveViewObject[];
	filterText: string;
	list: DeactiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
}

export default function DeactiveList(props: Props) {
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
