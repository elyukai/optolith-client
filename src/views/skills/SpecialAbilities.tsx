import * as React from 'react';
import * as SpecialAbilitiesActions from '../../actions/SpecialAbilitiesActions';
import ActivatableAddListItem from '../../components/ActivatableAddListItem';
import ActivatableRemoveListItem from '../../components/ActivatableRemoveListItem';
import BorderButton from '../../components/BorderButton';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import PhaseStore from '../../stores/PhaseStore';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import { filterAndSort } from '../../utils/ListUtils';

interface State {
	saActive: ActiveViewObject[];
	saDeactive: SpecialAbilityInstance[];
	filterText: string;
	sortOrder: string;
	phase: number;
	showAddSlidein: boolean;
}

export default class SpecialAbilities extends React.Component<any, State> {
	state = {
		filterText: '',
		phase: PhaseStore.get(),
		saActive: ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES),
		saDeactive: ActivatableStore.getDeactiveForView(Categories.SPECIAL_ABILITIES) as SpecialAbilityInstance[],
		showAddSlidein: false,
		sortOrder: SpecialAbilitiesStore.getSortOrder(),
	};

	_updateSpecialAbilitiesStore = () => this.setState({
		saActive: ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES),
		saDeactive: ActivatableStore.getDeactiveForView(Categories.SPECIAL_ABILITIES),
		sortOrder: SpecialAbilitiesStore.getSortOrder(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => SpecialAbilitiesActions.setSortOrder(option);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this._updateSpecialAbilitiesStore );
	}

	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this._updateSpecialAbilitiesStore );
	}

	render() {
		const { filterText, phase, saActive, saDeactive, showAddSlidein, sortOrder } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Gruppe', value: 'group' },
		];

		const listActive = filterAndSort(saActive, filterText, sortOrder);
		const listDeactive = filterAndSort(saDeactive, filterText, sortOrder);

		return (
			<div className="page" id="specialabilities">
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
						<div className="list-wrapper">
							{
								listDeactive.map(sa => (
									<ActivatableAddListItem
										key={sa.id}
										item={sa}
										addToList={SpecialAbilitiesActions.addToList}
										/>
								))
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
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<Scroll className="list">
					<div className="list-wrapper">
						{
							listActive.map((sa, index) => (
								<ActivatableRemoveListItem
									key={`SA_ACTIVE_${index}`}
									item={sa}
									phase={phase}
									removeFromList={SpecialAbilitiesActions.removeFromList}
									setTier={SpecialAbilitiesActions.setTier}
									/>
							))
						}
					</div>
				</Scroll>
			</div>
		);
	}
}
