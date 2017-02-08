import DisAdvAddListItem, { Deactive } from './DisAdvAddListItem';
import DisAdvRemoveListItem, { Active } from './DisAdvRemoveListItem';
import React, { Component, PropTypes } from 'react';
import Scroll from '../../components/Scroll';
import classNames from 'classnames';

interface Props {
	active?: boolean;
	list: Object[];
	rating: { [id: string]: string };
	showRating: boolean;
	type: string;
}

export default class DisAdvList extends Component<Props, any> {

	static propTypes = {
		active: PropTypes.bool,
		list: PropTypes.array,
		rating: PropTypes.object,
		showRating: PropTypes.bool,
		type: PropTypes.string
	};

	render() {

		const { active, list, rating, showRating, type } = this.props;

		return (
			<Scroll className="list">
				<div className="list-wrapper">
					{
						active ? (
							list.map((item, index) => (
								<DisAdvRemoveListItem key={`${type}_ACTIVE_${index}`} item={item} />
							))
						) : (
							list.map(item => {
								const className = classNames(showRating && rating.hasOwnProperty(item.id) && rating[item.id]);

								return (
									<DisAdvAddListItem key={item.id} item={item} className={className} />
								);
							})
						)
					}
				</div>
			</Scroll>
		);
	}
}
