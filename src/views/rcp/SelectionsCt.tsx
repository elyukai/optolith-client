import * as React from 'react';
import Checkbox from '../../components/Checkbox';

interface Props {
	active: Set<string>;
	amount: number;
	change: (id: string) => void;
	list: {
		id: string;
		name: string;
	}[];
	num: number;
}

export default class SelectionsCt extends React.Component<Props, undefined> {
	render() {
		const nums = ['Eine', 'Zwei'];

		const { active, amount, change, list, num } = this.props;

		return (
			<div className="ct list">
				<h4>{nums[num - 1]} der folgenden Kampftechniken {6 + amount}</h4>
				{
					list.map(obj => {
						const { id, name } = obj;
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
