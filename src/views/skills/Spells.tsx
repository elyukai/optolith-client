import * as React from 'react';
import * as SpellsActions from '../../actions/SpellsActions';
import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemGroup from '../../components/ListItemGroup';
import ListItemName from '../../components/ListItemName';
import Options from '../../components/Options';
import Page from '../../components/Page';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';
import ConfigStore from '../../stores/ConfigStore';
import PhaseStore from '../../stores/PhaseStore';
import SpellsStore from '../../stores/SpellsStore';
import { filterAndSort } from '../../utils/ListUtils';
import { isActivatable, isDecreasable, isIncreasable, isOwnTradition } from '../../utils/SpellUtils';
import SkillListItem from './SkillListItem';

interface State {
	addSpellsDisabled: boolean;
	areMaxUnfamiliar: boolean;
	filterText: string;
	filterTextSlidein: string;
	phase: number;
	showAddSlidein: boolean;
	sortOrder: string;
	spells: SpellInstance[];
	enableActiveItemHints: boolean;
}

export default class Spells extends React.Component<undefined, State> {
	state = {
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		filterText: '',
		filterTextSlidein: '',
		phase: PhaseStore.get(),
		showAddSlidein: false,
		sortOrder: SpellsStore.getSortOrder(),
		spells: SpellsStore.getAll(),
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	sort = (option: string) => SpellsActions.setSortOrder(option);
	addToList = (id: string) => SpellsActions.addToList(id);
	addPoint = (id: string) => SpellsActions.addPoint(id);
	removeFromList = (id: string) => SpellsActions.removeFromList(id);
	removePoint = (id: string) => SpellsActions.removePoint(id);
	switchActiveItemHints = () => SpellsActions.switchEnableActiveItemHints();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as State);

	componentDidMount() {
		ConfigStore.addChangeListener(this.updateConfigStore);
		SpellsStore.addChangeListener(this.updateSpellsStore);
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.updateConfigStore);
		SpellsStore.removeChangeListener(this.updateSpellsStore);
	}

	render() {
		const GROUPS = SpellsStore.getGroupNames();
		const PROPERTIES = SpellsStore.getPropertyNames();
		const TRADITIONS = SpellsStore.getTraditionNames();

		const { addSpellsDisabled, areMaxUnfamiliar, enableActiveItemHints, filterText, filterTextSlidein, phase, showAddSlidein, sortOrder, spells } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Gruppe', value: 'group' },
			{ name: 'Nach Merkmal', value: 'property' },
			{ name: 'Nach Steigerungsfaktor', value: 'ic' },
		];

		const listActive: SpellInstance[] = [];
		const listDeactive: SpellInstance[] = [];

		spells.forEach(e => {
			if (e.active) {
				listActive.push(e);
				if (enableActiveItemHints === true) {
					listDeactive.push(e);
				}
			}
			else if (isActivatable(e)) {
				if (!isOwnTradition(e)) {
					if (e.gr < 2 && !areMaxUnfamiliar) {
						listDeactive.push(e);
					}
				}
				else {
					listDeactive.push(e);
				}
			}
		});

		const sortedActiveList = filterAndSort(listActive, filterText, sortOrder);
		const sortedDeactiveList = filterAndSort(listDeactive, filterTextSlidein, sortOrder);

		return (
			<Page id="spells">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint="Suchen" value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={this.switchActiveItemHints}>Aktivierte anzeigen</Checkbox>
					</Options>
					<Scroll>
						<List>
							{
								sortedDeactiveList.map(obj => {
									let extendName = '';
									if (!isOwnTradition(obj)) {
										extendName += ` (${obj.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ')})`;
									}

									if (obj.active === true) {
										const { id, name } = obj;
										const extendedName = name + extendName;
										return (
											<ListItem key={id} disabled>
												<ListItemName main={extendedName} />
											</ListItem>
										);
									}

									const [ a, b, c, checkmod ] = obj.check;
									const check = [ a, b, c ];

									const name = obj.name + extendName;

									const add = obj.gr === 5 ? {} : {
										check,
										checkmod,
										ic: obj.ic,
									};

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, obj.id)}
											activateDisabled={addSpellsDisabled && obj.gr < 3}
											addFillElement
											{...add}
											>
											<ListItemGroup>
												{PROPERTIES[obj.property - 1]}
												{sortOrder === 'group' ? ` / ${GROUPS[obj.gr - 1]}` : null}
											</ListItemGroup>
										</SkillListItem>
									);
								})
							}
						</List>
					</Scroll>
				</Slidein>
				<Options>
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
				</Options>
				<Scroll>
					<List>
						{
							sortedActiveList.map(obj => {
								const [ a1, a2, a3, checkmod ] = obj.check;
								const check = [ a1, a2, a3 ];

								let name = obj.name;
								if (!isOwnTradition(obj)) {
									name += ` (${obj.tradition.map(e => TRADITIONS[e - 1]).sort().join(', ')})`;
								}

								const other = obj.gr === 5 ? {} : {
									addDisabled: !isIncreasable(obj),
									addPoint: this.addPoint.bind(null, obj.id),
									check,
									checkmod,
									ic: obj.ic,
									sr: obj.value,
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.gr === 5 || obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										addFillElement
										noIncrease={obj.gr === 5}
										{...other} >
										<ListItemGroup>
											{PROPERTIES[obj.property - 1]}
											{sortOrder === 'group' ? ` / ${GROUPS[obj.gr - 1]}` : null}
										</ListItemGroup>
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
			</Page>
		);
	}

	private updateSpellsStore = () => {
		this.setState({
			addSpellsDisabled: SpellsStore.isActivationDisabled(),
			areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
			sortOrder: SpellsStore.getSortOrder(),
			spells: SpellsStore.getAll(),
		} as State);
	}

	private updateConfigStore = () => {
		this.setState({
			enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
		} as State);
	}
}
