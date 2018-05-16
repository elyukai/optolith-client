import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { translate, UIMessages } from '../../utils/I18n';

export interface SelectionsCtProps {
	active: Set<string>;
	disabled?: Set<string>;
	amount: number;
	list: Array<{
		id: string;
		name: string;
	}>;
	locale: UIMessages;
	value: number;
	second?: boolean;
	change(id: string): void;
}

export function SelectionsCt(props: SelectionsCtProps) {
	const { active, amount, change, disabled, list, locale, value, second } = props;

	const amountTags = [translate(locale, 'rcpselections.labels.one'), translate(locale, 'rcpselections.labels.two')];

	const text = second ? translate(locale, 'rcpselections.labels.more') : translate(locale, 'rcpselections.labels.ofthefollowingcombattechniques');

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
