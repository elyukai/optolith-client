import Checkbox from '../../components/Checkbox';
import React, { Component, PropTypes } from 'react';

interface Props {
	active: Set<string>;
	change: (id: string) => void;
	list: {
		id: string;
		name: string;
	}[];
	num: number;
}

export default class SelectionsCantrips extends Component<Props, undefined> {
	render() {
		const nums = ['Ein Zaubertrick', 'Zwei Zaubertricks'];

		const { active, change, list, num } = this.props;

		return (
			<div className="cantrips list">
				<h4>{nums[num - 1]} aus folgender Liste</h4>
				{
					list.map(obj => {
						let { id, name } = obj;
						return (
							<Checkbox
								key={id}
								checked={active.has(id)}
								disabled={!active.has(id) && active.size >= num}
								label={name}
								onClick={change.bind(null, id)} />
						);
					})
				}
			</div>
		);
	}
}
