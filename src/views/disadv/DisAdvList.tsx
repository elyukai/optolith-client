import * as DisAdvActions from '../../actions/DisAdvActions';
import * as React from 'react';
import ActivatableAddListItem from '../../components/ActivatableAddListItem';
import ActivatableRemoveListItem from '../../components/ActivatableRemoveListItem';
import Scroll from '../../components/Scroll';
import classNames from 'classnames';

interface Props {
	active?: boolean;
	list: (AdvantageInstance | DisadvantageInstance | ActiveViewObject)[];
	phase: number;
	rating: { [id: string]: string };
	showRating: boolean;
	type: string;
}

export default class DisAdvList extends React.Component<Props, undefined> {
	render() {
		const { active, list: rawList, rating, showRating, type } = this.props;

		const list = active ? (
			rawList.map((item, index) => (
				<ActivatableRemoveListItem
					key={`${type}_ACTIVE_${index}`}
					item={item as ActiveViewObject}
					phase={this.props.phase}
					setTier={DisAdvActions.setTier}
					removeFromList={DisAdvActions.removeFromList}
					/>
			))
		) : (
			rawList.map(item => {
				const className = classNames(showRating && rating.hasOwnProperty(item.id) && rating[item.id]);

				return (
					<ActivatableAddListItem
						key={item.id}
						item={item as AdvantageInstance | DisadvantageInstance}
						className={className}
						addToList={DisAdvActions.addToList}
						/>
				);
			})
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
