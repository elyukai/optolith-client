import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import ActivatableRemoveList from '../../components/ActivatableRemoveList';
import List from '../../components/List';
import Scroll from '../../components/Scroll';
import { sort } from '../../utils/ListUtils';

interface Props {
	filterText: string;
	list: ActiveViewObject[];
	rating: { [id: string]: string };
	showRating: boolean;
}

export default function ActiveList(props: Props) {
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
