import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import Dropdown from '../../components/Dropdown';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import CultureStore from '../../stores/CultureStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import { filterAndSort } from '../../utils/ListUtils';
import ProfessionsListItem from './ProfessionsListItem';
import Selections from './Selections';

interface State {
	professions: ProfessionInstance[];
	currentID: string | null;
	currentVID: string | null;
	filterText: string;
	sortOrder: string;
	showAddSlidein: boolean;
	visibility: string;
}

export default class Professions extends React.Component<undefined, State> {
	state = {
		currentID: ProfessionStore.getCurrentId(),
		currentVID: ProfessionVariantStore.getCurrentID(),
		filterText: '',
		professions: ProfessionStore.getAll(),
		showAddSlidein: false,
		sortOrder: ProfessionStore.getSortOrder(),
		visibility: ProfessionStore.areAllVisible(),
	};

	_updateProfessionStore = () => this.setState({
		currentID: ProfessionStore.getCurrentId(),
		professions: ProfessionStore.getAll(),
		sortOrder: ProfessionStore.getSortOrder(),
		visibility: ProfessionStore.areAllVisible(),
	} as State);
	_updateProfessionVariantStore = () => this.setState({
		currentVID: ProfessionVariantStore.getCurrentID(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => ProfessionActions.setProfessionsSortOrder(option);
	changeView = (view: string) => ProfessionActions.setProfessionsVisibilityFilter(view);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	selectProfessionVariant = (id: string | null) => ProfessionVariantActions.selectProfessionVariant(id);

	componentDidMount() {
		ProfessionStore.addChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.addChangeListener(this._updateProfessionVariantStore);
	}

	componentWillUnmount() {
		ProfessionStore.removeChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.removeChangeListener(this._updateProfessionVariantStore);
	}

	render() {

		const { currentID, currentVID, filterText, professions, showAddSlidein, visibility, sortOrder } = this.state;

		const currentCulture = CultureStore.getCurrent();

		const sex = ProfileStore.getSex();

		const list = filterAndSort(professions.filter(e => visibility === 'all' || currentCulture!.typicalProfessions.includes(e.id) || e.id === 'P_0'), filterText, sortOrder, sex);

		return (
			<div className="page" id="professions">
				{
					showAddSlidein ? <Selections close={this.hideAddSlidein} /> : null
				}
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibility}
						onChange={this.changeView}
						options={[{id: 'all', name: 'Alle Professionen'}, {id: 'common', name: 'Übliche Professionen'}]}
						fullWidth />
					<RadioButtonGroup active={sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name',
						},
						{
							name: 'Nach Kosten',
							value: 'cost',
						},
					]} />
				</div>
				<Scroll className="list">
					<ul className="professions">
						{
							list.map(profession => <ProfessionsListItem
								key={profession.id}
								showAddSlidein={this.showAddSlidein}
								currentID={currentID}
								currentVID={currentVID}
								profession={profession}
								sex={sex}
								/>,
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}
