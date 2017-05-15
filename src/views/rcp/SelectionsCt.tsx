import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { translate } from '../../utils/I18n';

interface Props {
	active: Set<string>;
	disabled?: Set<string>;
	amount: number;
	list: Array<{
		id: string;
		name: string;
	}>;
	value: number;
	second?: boolean;
	change(id: string): void;
}

export class SelectionsCt extends React.Component<Props, undefined> {
	render() {
		const amountTags = [translate('rcpselections.labels.one'), translate('rcpselections.labels.two')];

		const { active, amount, change, disabled, list, value, second } = this.props;

		const text = second ? translate('rcpselections.labels.more') : translate('rcpselections.labels.ofthefollowingcombattechniques');

		return (
			<div className="ct list">
				<h4>{amountTags[amount - 1]} {text} {6 + value}</h4>
				{
					list.map(obj => {
						const { id, name } = obj;
						return (
							<Checkbox
								key={id}
								checked={active.has(id)}
								disabled={!active.has(id) && active.size >= amount || disabled && disabled.has(id)}
								label={name}
								onClick={change.bind(null, id)} />
						);
					})
				}
			</div>
		);
	}
}
