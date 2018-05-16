import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { translate, UIMessages } from '../../utils/I18n';

export interface SelectionsCantripsProps {
	active: Set<string>;
	list: {
		id: string;
		name: string;
	}[];
	locale: UIMessages;
	num: number;
	change(id: string): void;
}

export function SelectionsCantrips(props: SelectionsCantripsProps) {
	const { active, change, list, locale, num } = props;
	const nums = [translate(locale, 'rcpselections.labels.onecantrip'), translate(locale, 'rcpselections.labels.twocantrips')];

	return (
		<div className="cantrips list">
			<h4>{nums[num - 1]} {translate(locale, 'rcpselections.labels.fromthefollowinglist')}</h4>
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
