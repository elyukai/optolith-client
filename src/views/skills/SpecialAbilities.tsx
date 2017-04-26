import * as React from 'react';
import * as ConfigActions from '../../actions/ConfigActions';
import * as SpecialAbilitiesActions from '../../actions/SpecialAbilitiesActions';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import { ConfigStore } from '../../stores/ConfigStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { SpecialAbilitiesStore } from '../../stores/SpecialAbilitiesStore';
import { ActiveViewObject, InputTextEvent, SpecialAbilityInstance } from '../../types/data.d';

interface State {
	activeList: ActiveViewObject[];
	list: SpecialAbilityInstance[];
	filterText: string;
	filterTextSlidein: string;
	sortOrder: string;
	phase: number;
	showAddSlidein: boolean;
	enableActiveItemHints: boolean;
}

export class SpecialAbilities extends React.Component<undefined, State> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		phase: PhaseStore.get(),
		activeList: ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES),
		list: ActivatableStore.getDeactiveForView(Categories.SPECIAL_ABILITIES) as SpecialAbilityInstance[],
		showAddSlidein: false,
		sortOrder: SpecialAbilitiesStore.getSortOrder(),
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	sort = (option: string) => SpecialAbilitiesActions.setSortOrder(option);
	switchActiveItemHints = () => ConfigActions.switchEnableActiveItemHints();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as State);

	componentDidMount() {
		ConfigStore.addChangeListener(this.updateConfigStore);
		SpecialAbilitiesStore.addChangeListener(this.updateSpecialAbilitiesStore);
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.updateConfigStore);
		SpecialAbilitiesStore.removeChangeListener(this.updateSpecialAbilitiesStore);
	}

	render() {
		const { enableActiveItemHints, filterText, filterTextSlidein, phase, activeList, list, showAddSlidein, sortOrder } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Gruppe', value: 'groupname' },
		];

		const groupNames = SpecialAbilitiesStore.getGroupNames();

		return (
			<Page id="specialabilities">
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
					<ActivatableAddList
						activeList={enableActiveItemHints ? activeList : undefined}
						addToList={SpecialAbilitiesActions.addToList}
						filterText={filterTextSlidein}
						groupNames={groupNames}
						list={list}
						sortOrder={sortOrder}
						/>
				</Slidein>
				<Options>
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={sortArray}
						/>
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</Options>
				<ActivatableRemoveList
					filterText={filterText}
					groupNames={groupNames}
					list={activeList}
					phase={phase}
					removeFromList={SpecialAbilitiesActions.removeFromList}
					setTier={SpecialAbilitiesActions.setTier}
					sortOrder={sortOrder}
					/>
			</Page>
		);
	}

	private updateSpecialAbilitiesStore = () => {
		this.setState({
			activeList: ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES),
			list: ActivatableStore.getDeactiveForView(Categories.SPECIAL_ABILITIES),
			sortOrder: SpecialAbilitiesStore.getSortOrder(),
		} as State);
	}

	private updateConfigStore = () => {
		this.setState({
			enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
		} as State);
	}
}
