import * as React from 'react';
import * as ConfigActions from '../../actions/ConfigActions';
import * as SpellsActions from '../../actions/SpellsActions';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItem } from '../../components/ListItem';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import { ConfigStore } from '../../stores/ConfigStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { SpellsStore } from '../../stores/SpellsStore';
import { CantripInstance, InputTextEvent, SpellInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { filterAndSort } from '../../utils/ListUtils';
import { isActivatable, isDecreasable, isIncreasable, isOwnTradition } from '../../utils/SpellUtils';
import { SkillListItem } from './SkillListItem';

interface State {
	addSpellsDisabled: boolean;
	areMaxUnfamiliar: boolean;
	filterText: string;
	filterTextSlidein: string;
	phase: number;
	showAddSlidein: boolean;
	sortOrder: string;
	spells: (SpellInstance | CantripInstance)[];
	enableActiveItemHints: boolean;
}

export class Spells extends React.Component<{}, State> {
	state = {
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		areMaxUnfamiliar: SpellsStore.areMaxUnfamiliar(),
		filterText: '',
		filterTextSlidein: '',
		phase: PhaseStore.get(),
		showAddSlidein: false,
		sortOrder: SpellsStore.getSortOrder(),
		spells: [ ...SpellsStore.getAll(), ...SpellsStore.getAllCantrips() ],
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	sort = (option: string) => SpellsActions.setSortOrder(option);
	addToList = (id: string) => SpellsActions.addToList(id);
	addPoint = (id: string) => SpellsActions.addPoint(id);
	removeFromList = (id: string) => SpellsActions.removeFromList(id);
	removePoint = (id: string) => SpellsActions.removePoint(id);
	switchActiveItemHints = () => ConfigActions.switchEnableActiveItemHints();
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
		const { addSpellsDisabled, areMaxUnfamiliar, enableActiveItemHints, filterText, filterTextSlidein, phase, showAddSlidein, sortOrder, spells } = this.state;

		const sortArray = [
			{ name: translate('options.sortorder.alphabetically'), value: 'name' },
			{ name: translate('options.sortorder.group'), value: 'group' },
			{ name: translate('options.sortorder.property'), value: 'property' },
			{ name: translate('options.sortorder.improvementcost'), value: 'ic' }
		];

		const listActive: (SpellInstance | CantripInstance)[] = [];
		const listDeactive: (SpellInstance | CantripInstance)[] = [];

		spells.forEach(e => {
			if (e.active) {
				listActive.push(e);
				if (enableActiveItemHints === true) {
					listDeactive.push(e);
				}
			}
			else if (isActivatable(e)) {
				if (!isOwnTradition(e)) {
					if (e.category === Categories.CANTRIPS || e.gr < 2 && !areMaxUnfamiliar) {
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
						<TextField hint={translate('options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={sortArray}
							/>
						<Checkbox checked={enableActiveItemHints} onClick={this.switchActiveItemHints}>{translate('options.showactivated')}</Checkbox>
					</Options>
					<Scroll>
						<List>
							{
								sortedDeactiveList.map((obj, index, array) => {
									const prevObj = array[index - 1];

									let extendName = '';
									if (!isOwnTradition(obj)) {
										extendName += ` (${obj.tradition.map(e => translate('spells.view.traditions')[e - 1]).sort().join(', ')})`;
									}

									if (obj.active === true) {
										const { id, name } = obj;
										const extendedName = name + extendName;
										return (
											<ListItem key={id} disabled>
												<ListItemName name={extendedName} />
											</ListItem>
										);
									}

									const name = obj.name + extendName;

									if (obj.category === Categories.CANTRIPS) {
										return (
											<SkillListItem
												key={obj.id}
												id={obj.id}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, obj.id)}
												addFillElement
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
												>
												<ListItemGroup>
													{translate('spells.view.properties')[obj.property - 1]}
													{sortOrder === 'group' ? ` / ${translate('spells.view.cantrip')}` : null}
												</ListItemGroup>
											</SkillListItem>
										);
									}

									const [ a, b, c, checkmod ] = obj.check;
									const check = [ a, b, c ];

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, obj.id)}
											activateDisabled={addSpellsDisabled && obj.gr < 3}
											addFillElement
											check={check}
											checkmod={checkmod}
											ic={obj.ic}
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
											>
											<ListItemGroup>
												{translate('spells.view.properties')[obj.property - 1]}
												{sortOrder === 'group' ? ` / ${translate('spells.view.groups')[obj.gr - 1]}` : null}
											</ListItemGroup>
										</SkillListItem>
									);
								})
							}
						</List>
					</Scroll>
				</Slidein>
				<Options>
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={sortArray}
						/>
					<BorderButton
						label={translate('actions.addtolist')}
						onClick={this.showAddSlidein}
						/>
				</Options>
				<Scroll>
					<List>
						{
							sortedActiveList.map((obj, index, array) => {
								const prevObj = array[index - 1];

								let name = obj.name;
								if (!isOwnTradition(obj)) {
									name += ` (${obj.tradition.map(e => translate('spells.view.traditions')[e - 1]).sort().join(', ')})`;
								}

								if (obj.category === Categories.CANTRIPS) {
									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={phase < 3 ? this.removeFromList.bind(null, obj.id) : undefined}
											addFillElement
											noIncrease
											insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.CANTRIPS}
											>
											<ListItemGroup>
												{translate('spells.view.properties')[obj.property - 1]}
												{sortOrder === 'group' ? ` / ${translate('spells.view.cantrip')}` : null}
											</ListItemGroup>
										</SkillListItem>
									);
								}

								const [ a1, a2, a3, checkmod ] = obj.check;
								const check = [ a1, a2, a3 ];

								const other = {
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
										removePoint={phase < 3 ? obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										addFillElement
										insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.CANTRIPS || prevObj.gr !== obj.gr)}
										{...other} >
										<ListItemGroup>
											{translate('spells.view.properties')[obj.property - 1]}
											{sortOrder === 'group' ? ` / ${translate('spells.view.groups')[obj.gr - 1]}` : null}
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
			spells: [ ...SpellsStore.getAll(), ...SpellsStore.getAllCantrips() ]
		} as State);
	}

	private updateConfigStore = () => {
		this.setState({
			enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
		} as State);
	}
}
