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
import { translate } from '../../utils/I18n';
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

export class Liturgies extends React.Component<{}, State> {
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
		const { addChantsDisabled, enableActiveItemHints, filterText, filterTextSlidein, phase, showAddSlidein, sortOrder, liturgies } = this.state;

		const sortArray = [
			{ name: translate('options.sortorder.alphabetically'), value: 'name' },
			{ name: translate('options.sortorder.aspect'), value: 'aspect' },
			{ name: translate('options.sortorder.group'), value: 'group' },
			{ name: translate('options.sortorder.improvementcost'), value: 'ic' }
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

									if (obj.active === true) {
										const { id, name } = obj;
										return (
											<ListItem key={id} disabled>
												<ListItemName name={name} />
											</ListItem>
										);
									}

									const { name } = obj;

									const aspc = obj.aspects.map(e => translate('liturgies.view.aspects')[e - 1]).sort().join(', ');

									if (obj.category === Categories.BLESSINGS) {
										return (
											<SkillListItem
												key={obj.id}
												id={obj.id}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, obj.id)}
												addFillElement
												insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
												>
												<ListItemGroup>
													{aspc}
													{sortOrder === 'group' && ` / ${translate('liturgies.view.blessing')}`}
												</ListItemGroup>
											</SkillListItem>
										);
									}

									const { check, checkmod, ic } = obj;
									const add = { check, checkmod, ic };

									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											isNotActive
											activate={this.addToList.bind(null, obj.id)}
											activateDisabled={addChantsDisabled && obj.gr < 3}
											addFillElement
											insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
											{...add}
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / ${translate('liturgies.view.groups')[obj.gr - 1]}`}
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

								const name = obj.name;

								const aspc = obj.aspects.map(e => translate('liturgies.view.aspects')[e - 1]).sort().join(', ');

								if (obj.category === Categories.BLESSINGS) {
									return (
										<SkillListItem
											key={obj.id}
											id={obj.id}
											name={name}
											removePoint={phase < 3 ? this.removeFromList.bind(null, obj.id) : undefined}
											addFillElement
											noIncrease
											insertTopMargin={sortOrder === 'group' && prevObj && prevObj.category !== Categories.BLESSINGS}
											>
											<ListItemGroup>
												{aspc}
												{sortOrder === 'group' && ` / ${translate('liturgies.view.blessing')}`}
											</ListItemGroup>
										</SkillListItem>
									);
								}

								const { check, checkmod, ic, value } = obj;

								const add = {
									addDisabled: !isIncreasable(obj),
									addPoint: this.addPoint.bind(null, obj.id),
									check,
									checkmod,
									ic,
									sr: value,
								};

								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={name}
										removePoint={phase < 3 ? obj.value === 0 ? this.removeFromList.bind(null, obj.id) : this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										addFillElement
										insertTopMargin={sortOrder === 'group' && prevObj && (prevObj.category === Categories.BLESSINGS || prevObj.gr !== obj.gr)}
										{...add}
										>
										<ListItemGroup>
											{aspc}
											{sortOrder === 'group' && ` / ${translate('liturgies.view.groups')[obj.gr - 1]}`}
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
