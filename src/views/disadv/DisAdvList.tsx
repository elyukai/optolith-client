import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import ActivatableAddListItem from '../../components/ActivatableAddListItem';
import ActivatableRemoveListItem from '../../components/ActivatableRemoveListItem';
import Scroll from '../../components/Scroll';
import { sortByName } from '../../utils/ListUtils';

interface Props {
	active?: boolean;
	list: Array<AdvantageInstance | DisadvantageInstance | ActiveViewObject>;
	phase: number;
	rating: { [id: string]: string };
	showRating: boolean;
	type: string;
}

export default class DisAdvList extends React.Component<Props, undefined> {
	render() {
		const { active, list: rawList, rating, showRating, type } = this.props;

		rawList.sort(sortByName);

		const list = active ? (
			rawList.map((item, index) => (
				<ActivatableRemoveListItem
					key={`${type}_ACTIVE_${index}`}
					item={item as ActiveViewObject}
					phase={this.props.phase}
					setTier={DisAdvActions.setTier}
					removeFromList={DisAdvActions.removeFromList}
					isImportant={rating[item.id] === 'IMP' && showRating}
					isTypical={rating[item.id] === 'TYP' && showRating}
					isUntypical={rating[item.id] === 'UNTYP' && showRating}
					/>
			))
		) : (
			rawList.map(item => (
				<ActivatableAddListItem
					key={item.id}
					item={item as AdvantageInstance | DisadvantageInstance}
					addToList={DisAdvActions.addToList}
					isImportant={rating[item.id] === 'IMP' && showRating}
					isTypical={rating[item.id] === 'TYP' && showRating}
					isUntypical={rating[item.id] === 'UNTYP' && showRating}
					/>
			))
		);

		return (
			<Scroll className="list">
				<div className="list-wrapper">
					{list}
				</div>
			</Scroll>
		);
	}
}
