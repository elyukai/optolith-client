import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { get } from '../../stores/ListStore';
import { InputTextEvent, SpecialisationSelection, TalentInstance } from '../../types/data.d';

interface Props {
	active: [number | null, string];
	activeId?: string;
	options: SpecialisationSelection;
	change(value: string | number): void;
	changeId(id: string): void;
}

export class SelectionsTalentSpec extends React.Component<Props, undefined> {

	changeByInput = (event: InputTextEvent) => this.props.change(event.target.value);
	changeId = (id: string) => this.props.changeId(id);

	render() {
		const { active, activeId, change, changeId, options: { sid } } = this.props;

		let talent;
		let name;
		let list;
		let input;
		if (Array.isArray(sid) && !activeId) {
			list = sid.map(e => (get(e) as TalentInstance));
			name = list.map(e => e.name).join(' oder ');
		}
		else {
			talent = get(Array.isArray(sid) ? activeId! : sid) as TalentInstance;
			name = talent.name;
			list = talent.specialisation && talent.specialisation.map((e, id) => ({ id: id + 1, name: e }));
			input = talent.specialisationInput;
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
							onChange={this.changeByInput}
							/>
					) : null
				}
			</div>
		);

		return (
			<div className="spec">
				<h4>
					Anwendungsgebiet für Fertigkeitsspezialisierung ({name})
				</h4>
				{selectTalentElement}
				{selectionElement}
			</div>
		);
	}
}

