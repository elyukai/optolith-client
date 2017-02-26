import { filterAndSort } from '../../utils/ListUtils';
import * as React from 'react';
import * as SpellsActions from '../../actions/SpellsActions';
import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import Slidein from '../../components/Slidein';
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

export default class Spells extends React.Component<undefined, State> {

	state = {
		spells: SpellsStore.getAll(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		filterText: '',
		sortOrder: SpellsStore.getSortOrder(),
		phase: PhaseStore.get(),
		showAddSlidein: false
	};

	_updateSpellsStore = () => this.setState({
		spells: SpellsStore.getAll(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		sortOrder: SpellsStore.getSortOrder()
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => SpellsActions.setSortOrder(option);
	addToList = (id: string) => SpellsActions.addToList(id);
	addPoint = (id: string) => SpellsActions.addPoint(id);
	removeFromList = (id: string) => SpellsActions.removeFromList(id);
	removePoint = (id: string) => SpellsActions.removePoint(id);
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

		const listActive: SpellInstance[] = [];
		const listDeactive: SpellInstance[] = [];

		list.forEach(e => {
			if (e.active) {
				listActive.push(e);
			}
			else {
				if (!e.isOwnTradition) {
					if (e.gr < 2 && !areMaxUnfamiliar) {
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
						<Checkbox
							checked={true}
							onClick={() => undefined}
							disabled
							/>
					</div>
					<Scroll className="list">
						<div className="list-wrapper">
							{
								listDeactive.map(spell => {
									const [ a, b, c, checkmod ] = spell.check;
									const check = [ a, b, c ];

									let name = spell.name;
									if (!spell.isOwnTradition) {
										name += ` (${spell.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ')})`;
									}

									const obj = spell.gr === 5 ? {} : {
										check,
										checkmod,
										ic: spell.ic
									};

									return (
										<SkillListItem
											key={spell.id}
											id={spell.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, spell.id)}
											activateDisabled={addSpellsDisabled && spell.gr < 3}
											addFillElement
											{...obj}
											>
											<div className="property">{PROPERTIES[spell.property - 1]}</div>
										</SkillListItem>
									);
								})
							}
						</div>
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
					<div className="list-wrapper">
						{
							listActive.map(obj => {
								const [ a1, a2, a3, checkmod ] = obj.check;
								const check = [ a1, a2, a3 ];

								let name = obj.name;
								if (!obj.isOwnTradition) {
									name += ` (${obj.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ')})`;
								}

								const other = obj.gr === 5 ? {} : {
									sr: obj.value,
									check,
									checkmod,
									ic: obj.ic,
									addPoint: this.addPoint.bind(null, obj.id),
									addDisabled: !obj.isIncreasable
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.gr === 5 || obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!obj.isDecreasable}
										addFillElement
										noIncrease={obj.gr === 5}
										{...other} >
										<div className="property">{PROPERTIES[obj.property - 1]}</div>
									</SkillListItem>
								);
							})
						}
					</div>
				</Scroll>
			</div>
		);
	}
}
