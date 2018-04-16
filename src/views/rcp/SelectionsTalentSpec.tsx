import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { InputTextEvent, SpecialisationSelection, TalentInstance } from '../../types/data.d';
import { _translate, UIMessages } from '../../utils/I18n';
import { Application } from '../../types/wiki';

export interface SelectionsTalentSpecProps {
	active: [number | null, string];
	activeId?: string;
	options: SpecialisationSelection;
	locale: UIMessages;
	skills: Map<string, TalentInstance>;
	change(value: string | number): void;
	changeId(id: string): void;
}

export function SelectionsTalentSpec(props: SelectionsTalentSpecProps) {
	const { active, activeId, change, changeId, locale, options: { sid }, skills } = props;

	let skillList: TalentInstance[] | undefined;
	let applicationList: Application[] | undefined;
	let talent: TalentInstance | undefined;
	let name;
	let input;
	if (!Array.isArray(sid) || activeId !== undefined) {
		talent = skills.get(Array.isArray(sid) ? activeId! : sid)!;
		applicationList = talent.applications;
		input = talent.applicationsInput;
	}
	if (Array.isArray(sid)) {
		skillList = sid.map(e => skills.get(e)!);
		name = skillList.map(e => e.name).join(` ${_translate(locale, 'rcpselections.labels.applicationforskillspecialization')} `);
	}
	else if (talent !== undefined) {
		name = talent.name;
	}

	const selectTalentElement = Array.isArray(skillList) && (
		<div>
			<Dropdown
				className="talents"
				value={activeId}
				onChange={changeId}
				options={skillList}
				/>
		</div>
	);

	const selectionElement = talent && (
		<div>
			{
				Array.isArray(applicationList) && (
					<Dropdown
						className="tiers"
						value={active[0] || 0}
						onChange={change}
						options={applicationList}
						disabled={active[1] !== ''}
						/>
				)
			}
			{
				typeof input === 'string' && (
					<TextField
						hint={input}
						value={active[1]}
						onChange={(event: InputTextEvent) => change(event.target.value)}
						/>
				)
			}
		</div>
	);

	return (
		<div className="spec">
			<h4>
				{_translate(locale, 'rcpselections.labels.applicationforskillspecialization')} ({name})
			</h4>
			{selectTalentElement}
			{selectionElement}
		</div>
	);
}

