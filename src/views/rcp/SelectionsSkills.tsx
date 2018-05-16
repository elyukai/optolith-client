import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { TalentInstance } from '../../types/data';
import { translate, UIMessages } from '../../utils/I18n';

export interface SelectionsSkillsProps {
	active: Map<string, number>;
	gr?: number;
	left: number;
	list: TalentInstance[];
	locale: UIMessages;
	value: number;
	add(id: string): void;
	remove(id: string): void;
}

export function SelectionsSkills(props: SelectionsSkillsProps) {
	const { active, add, gr = 0, left, list, locale, remove, value } = props;

	return (
		<div className="skills list">
			<h4>{translate(locale, 'rcpselections.labels.skills', translate(locale, 'rcpselections.labels.skillgroups')[gr], value, left)}</h4>
			{
				list.map(obj => {
					const { id, name, ic } = obj;
					const sr = active.get(id);
					return (
						<div key={id}>
							<div className="skillname">{name}</div>
							<span>{typeof sr === 'number' ? sr / ic : 0}</span>
							<BorderButton
								label="+"
								disabled={left < ic}
								onClick={add.bind(null, id)}/>
							<BorderButton
								label="-"
								disabled={!active.has(id)}
								onClick={remove.bind(null, id)}/>
						</div>
					);
				})
			}
		</div>
	);
}
