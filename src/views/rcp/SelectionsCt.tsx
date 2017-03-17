import * as React from 'react';
import Checkbox from '../../components/Checkbox';

interface Props {
	active: Set<string>;
	disabled?: Set<string>;
	amount: number;
	list: Array<{
		id: string;
		name: string;
	}>;
	num: number;
	second?: boolean;
	change(id: string): void;
}

export default class SelectionsCt extends React.Component<Props, undefined> {
	render() {
		const nums = ['Eine', 'Zwei'];

		const { active, amount, change, disabled, list, num, second } = this.props;

		const text = second ? 'weitere' : 'der folgenden Kampftechniken';

		return (
			<div className="ct list">
				<h4>{nums[num - 1]} {text} {6 + amount}</h4>
				{
					list.map(obj => {
						const { id, name } = obj;
						return (
							<Checkbox
								key={id}
								checked={active.has(id)}
								disabled={!active.has(id) && active.size >= num || disabled && disabled.has(id)}
								label={name}
								onClick={change.bind(null, id)} />
						);
					})
				}
			</div>
		);
	}
}
