import { filterAndSort } from '../../utils/ListUtils';
import { SpellInstance } from '../../utils/data/Spell';
import BorderButton from '../../components/BorderButton';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import Slidein from '../../components/Slidein';
import SpellsActions from '../../actions/SpellsActions';
import SpellsStore from '../../stores/SpellsStore';
import TextField from '../../components/TextField';

interface State {
	spells: SpellInstance[];
	addSpellsDisabled: boolean;
	areMaxUnfamiliar: boolean;
	filterText: string;
	sortOrder: string;
	phase: number;
	showAddSlidein: boolean;
}

export default class Spells extends Component<any, State> {
	
	state = { 
		spells: SpellsStore.getAll(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		filterText: SpellsStore.getFilterText(),
		sortOrder: SpellsStore.getSortOrder(),
		phase: PhaseStore.get(),
		showAddSlidein: false
	};
	
	_updateSpellsStore = () => this.setState({ 
		spells: SpellsStore.getAll(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		filterText: SpellsStore.getFilterText(),
		sortOrder: SpellsStore.getSortOrder()
	} as State);

	filter = event => SpellsActions.filter(event.target.value);
	sort = option => SpellsActions.sort(option);
	addToList = id => SpellsActions.addToList(id);
	addPoint = id => SpellsActions.addPoint(id);
	removeFromList = id => SpellsActions.removeFromList(id);
	removePoint = id => SpellsActions.removePoint(id);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);
	
	componentDidMount() {
		SpellsStore.addChangeListener(this._updateSpellsStore );
	}
	
	componentWillUnmount() {
		SpellsStore.removeChangeListener(this._updateSpellsStore );
	}

	render() {

		const GROUPS = SpellsStore.getGroupNames();
		const PROPERTIES = SpellsStore.getPropertyNames();
		const TRADITIONS = SpellsStore.getTraditionNames();

		const { addSpellsDisabled, areMaxUnfamiliar, filterText, phase, showAddSlidein, sortOrder, spells } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Gruppe', value: 'group' },
			{ name: 'Nach Merkmal', value: 'property' },
			{ name: 'Nach Steigerungsfaktor', value: 'ic' }
		];

		const list = filterAndSort(spells, filterText, sortOrder);

		const listActive = [];
		const listDeactive = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
			}
			else {
				if (!e.isOwnTradition) {
					if (e.gr < 2 && !areMaxUnfamiliar) {
						e.name_add = e.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ');
						listDeactive.push(e);
					}
				}
				else {
					listDeactive.push(e);
				}			
			}
		});

		return (
			<div className="page" id="spells">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={sortArray}
							/>
					</div>
					<Scroll className="list">
						<table className="list">
							<thead>
								<tr>
									<td className="type">Gruppe</td>
									<td className="name">Zauber</td>
									<td className="merk">Merkmal</td>
									<td className="check">Probe</td>
									<td className="skt">Sf.</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									listDeactive.map(spell => {
										const [ a, b, c, checkmod ] = spell.check;
										const check = [ a, b, c ];

										let name = spell.name;
										if (!spell.isOwnTradition) {
											name += ` (${spell.name_add})`;
										}

										const obj = spell.gr === 5 ? {} : {
											check,
											checkmod,
											ic: spell.ic
										};

										return (
											<SkillListItem
												key={spell.id}
												group={GROUPS[spell.gr - 1]}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, spell.id)}
												activateDisabled={addSpellsDisabled && spell.gr < 3}
												{...obj}
												>
												<td className="merk">{PROPERTIES[spell.property - 1]}</td>
											</SkillListItem>
										);
									})
								}
							</tbody>
						</table>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={sortArray}
						/>
					<BorderButton
						label="Hinzufügen"
						onClick={this.showAddSlidein}
						/>
				</div>
				<Scroll className="list">
					<table className="list">
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Zauber</td>
								<td className="fw">Fw</td>
								<td className="merk">Merkmal</td>
								<td className="check">Probe</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								listActive.map(obj => {
									const [ a1, a2, a3, checkmod ] = obj.check;
									const check = [ a1, a2, a3 ];

									let name = obj.name;
									if (!obj.isOwnTradition) name += ` (${obj.name_add})`;

									const other = obj.gr === 5 ? {} : {
										sr: obj.value,
										check,
										checkmod,
										ic: obj.ic,
										addPoint: this.addPoint.bind(null, obj.id),
										addDisabled: obj.disabledIncrease
									};

									return (
										<SkillListItem
											key={obj.id}
											group={GROUPS[obj.gr - 1]}
											name={name}
											removePoint={phase < 3 ? obj.gr === 5 || obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
											removeDisabled={obj.disabledDecrease}
											{...other} >
											<td className="merk">{PROPERTIES[obj.property - 1]}</td>
										</SkillListItem>
									);
								})
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}
