import DisAdvAddListItem from './DisAdvAddListItem';
import DisAdvRemoveListItem from './DisAdvRemoveListItem';
import React, { Component, PropTypes } from 'react';
import Scroll from '../../layout/Scroll';
import classNames from 'classnames';

class DisAdvList extends Component {

	static propTypes = {
		active: PropTypes.bool,
		list: PropTypes.array,
		rating: PropTypes.object,
		showRating: PropTypes.bool,
		type: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {

		const { active, list, rating, showRating, type } = this.props;

		return (
			<Scroll className="list">
				<table>
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

export default DisAdvList;
