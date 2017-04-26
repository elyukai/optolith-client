import * as React from 'react';
import * as ConfigActions from '../../actions/ConfigActions';
import * as LiturgiesActions from '../../actions/LiturgiesActions';
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
import { LiturgiesStore } from '../../stores/LiturgiesStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { BlessingInstance, InputTextEvent, LiturgyInstance } from '../../types/data.d';
import { filterAndSort } from '../../utils/ListUtils';
import { isDecreasable, isIncreasable, isOwnTradition } from '../../utils/LiturgyUtils';
import { SkillListItem } from './SkillListItem';

interface State {
	addChantsDisabled: boolean;
	filterText: string;
	filterTextSlidein: string;
	liturgies: (BlessingInstance | LiturgyInstance)[];
	phase: number;
	showAddSlidein: boolean;
	sortOrder: string;
	enableActiveItemHints: boolean;
}

export class Liturgies extends React.Component<undefined, State> {
	state = {
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		filterText: '',
		filterTextSlidein: '',
		liturgies: [ ...LiturgiesStore.getAll(), ...LiturgiesStore.getAllBlessings() ],
		phase: PhaseStore.get(),
		showAddSlidein: false,
		sortOrder: LiturgiesStore.getSortOrder(),
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	sort = (option: string) => LiturgiesActions.setSortOrder(option);
	addToList = (id: string) => LiturgiesActions.addToList(id);
	addPoint = (id: string) => LiturgiesActions.addPoint(id);
	removeFromList = (id: string) => LiturgiesActions.removeFromList(id);
	removePoint = (id: string) => LiturgiesActions.removePoint(id);
	switchActiveItemHints = () => ConfigActions.switchEnableActiveItemHints();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as State);

	componentDidMount() {
		ConfigStore.addChangeListener(this.updateConfigStore);
		LiturgiesStore.addChangeListener(this.updateLiturgiesStore);
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.updateConfigStore);
		LiturgiesStore.removeChangeListener(this.updateLiturgiesStore);
	}

	render() {
		const GROUPS = LiturgiesStore.getGroupNames();
		const ASPECTS = LiturgiesStore.getAspectNames();

		const { addChantsDisabled, enableActiveItemHints, filterText, filterTextSlidein, phase, showAddSlidein, sortOrder, liturgies } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Aspekt', value: 'aspect' },
			{ name: 'Nach Gruppe', value: 'group' },
			{ name: 'Nach Steigerungsfaktor', value: 'ic' },
		];

		const listActive: (BlessingInstance | LiturgyInstance)[] = [];
		const listDeactive: (BlessingInstance | LiturgyInstance)[] = [];

		liturgies.forEach(e => {
			if (e.active) {
				listActive.push(e);
				if (enableActiveItemHints === true) {
					listDeactive.push(e);
				}
			}
			else {
				if (isOwnTradition(e)) {
					listDeactive.push(e);
				}
			}
		});

		const sortedActiveList = filterAndSort(listActive, filterText, sortOrder);
		const sortedDeactiveList = filterAndSort(listDeactive, filterTextSlidein, sortOrder);

		return (
			<Page id="liturgies">
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
									if (obj.active === true) {
										const { id, name } = obj;
										return (
											<ListItem key={id} disabled>
												<ListItemName name={name} />
											</ListItem>
										);
									}

									const name = obj.name;

									const aspc = obj.aspects.map(e => ASPECTS[e - 1]).sort().join(', ');

									if (obj.category === Categories.BLESSINGS) {
										return (
											<SkillListItem
												key={obj.id}
												id={obj.id}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, obj.id)}
												addFillElement
												>
												<ListItemGroup>
													{aspc}
													{sortOrder === 'group' && ` / Segnung`}
												</ListItemGroup>
											</SkillListItem>
										);
									}

									const [ a, b, c, checkmod ] = obj.check;
									const check = [ a, b, c ];

									const add = {
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
											activateDisabled={addChantsDisabled && obj.gr < 3}
											addFillElement
											{...add}
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / ${GROUPS[obj.gr - 1]}`}
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
								const name = obj.name;

								const aspc = obj.aspects.map(e => ASPECTS[e - 1]).sort().join(', ');

								if (obj.category === Categories.BLESSINGS) {
									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={phase < 3 ? this.removeFromList.bind(null, obj.id) : undefined}
											addFillElement
											noIncrease
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / Segnung`}
											</ListItemGroup>
										</SkillListItem>
									);
								}

								const [ a1, a2, a3, checkmod ] = obj.check;
								const check = [ a1, a2, a3 ];

								const add = {
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
										{...add}
										>
										<ListItemGroup>
											{aspc}
											{sortOrder === 'group' && ` / ${GROUPS[obj.gr - 1]}`}
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

	private updateLiturgiesStore = () => {
		this.setState({
			addChantsDisabled: LiturgiesStore.isActivationDisabled(),
			liturgies: [ ...LiturgiesStore.getAll(), ...LiturgiesStore.getAllBlessings() ],
			sortOrder: LiturgiesStore.getSortOrder(),
		} as State);
	}

	private updateConfigStore = () => {
		this.setState({
			enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
		} as State);
	}
}
