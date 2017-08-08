import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { InputTextEvent, SpecialisationSelection, TalentInstance } from '../../types/data.d';
import { _translate, UIMessages } from '../../utils/I18n';

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

	let talent;
	let name;
	let list;
	let input;
	if (Array.isArray(sid) && !activeId) {
		list = sid.map(e => skills.get(e)!);
		name = list.map(e => e.name).join(' oder ');
	}
	else {
		talent = skills.get(Array.isArray(sid) ? activeId! : sid)!;
		name = talent.name;
		list = talent.applications;
		input = talent.applicationsInput;
	}

	const selectTalentElement = Array.isArray(sid) && (
		<div>
			<Dropdown
				className="talents"
				value={activeId || ''}
				onChange={changeId}
				options={list!}
				/>
		</div>
	);

	const selectionElement = talent && (
		<div>
			{
				list ? (
					<Dropdown
						className="tiers"
						value={active[0] || 0}
						onChange={change}
						options={list}
						disabled={active[1] !== ''}
						/>
				) : null
			}
			{
				input !== null ? (
					<TextField
						hint={input}
						value={active[1]}
						onChange={(event: InputTextEvent) => change(event.target.value)}
						/>
				) : null
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

