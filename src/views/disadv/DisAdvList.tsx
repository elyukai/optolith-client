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
				<table className="list large-list">
					<thead>
						<tr>
							<td className="name">{type === 'ADV' ? 'Vorteil' : 'Nachteil'}</td>
							<td className="ap">AP</td>
							<td className="inc"></td>
						</tr>
					</thead>
					<tbody>
						{
							active ? (
								list.map((item, index) => (
									<DisAdvRemoveListItem key={`${type}_ACTIVE_${index}`} item={item} />
								))
							) : (
								list.map((item, index) => {
									const className = classNames(showRating && rating.hasOwnProperty(item.id) && rating[item.id]);

									return (
										<DisAdvAddListItem key={`${type}_DEACTIVE_${index}`} item={item} className={className} />
									);
								})
							)
						}
					</tbody>
				</table>
			</Scroll>
		);
	}
}
