import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CultureStore } from '../../stores/CultureStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { InputTextEvent, ProfessionInstance } from '../../types/data.d';
import { filterAndSort } from '../../utils/ListUtils';
import { ProfessionsListItem } from './ProfessionsListItem';
import { Selections } from './Selections';

interface State {
	professions: ProfessionInstance[];
	currentID?: string;
	currentVID?: string;
	filterText: string;
	sortOrder: string;
	showAddSlidein: boolean;
	visibility: string;
	groupVisibility: number;
	extensionVisibility: boolean;
}

export class Professions extends React.Component<undefined, State> {
	state = {
		currentID: ProfessionStore.getCurrentId(),
		currentVID: ProfessionVariantStore.getCurrentID(),
		filterText: '',
		professions: ProfessionStore.getAllValid(),
		showAddSlidein: false,
		sortOrder: ProfessionStore.getSortOrder(),
		visibility: ProfessionStore.getVisibilityFilter(),
		groupVisibility: ProfessionStore.getGroupVisibilityFilter(),
		extensionVisibility: ProfessionStore.getExpansionVisibilityFilter()
	};

	_updateProfessionStore = () => this.setState({
		currentID: ProfessionStore.getCurrentId(),
		professions: ProfessionStore.getAllValid(),
		sortOrder: ProfessionStore.getSortOrder(),
		visibility: ProfessionStore.getVisibilityFilter(),
		groupVisibility: ProfessionStore.getGroupVisibilityFilter(),
		extensionVisibility: ProfessionStore.getExpansionVisibilityFilter()
	} as State);
	_updateProfessionVariantStore = () => this.setState({
		currentVID: ProfessionVariantStore.getCurrentID(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => ProfessionActions.setProfessionsSortOrder(option);
	changeView = (view: string) => ProfessionActions.setProfessionsVisibilityFilter(view);
	changeGroupVisibility = (id: number) => ProfessionActions.setProfessionsGroupVisibilityFilter(id);
	switchExtensionVisibility = () => ProfessionActions.switchProfessionsExpansionVisibilityFilter();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	selectProfessionVariant = (id?: string) => ProfessionVariantActions.selectProfessionVariant(id);

	componentDidMount() {
		ProfessionStore.addChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.addChangeListener(this._updateProfessionVariantStore);
	}

	componentWillUnmount() {
		ProfessionStore.removeChangeListener(this._updateProfessionStore);
		ProfessionVariantStore.removeChangeListener(this._updateProfessionVariantStore);
	}

	render() {

		const { currentID, currentVID, filterText, professions, showAddSlidein, visibility, groupVisibility, extensionVisibility, sortOrder } = this.state;

		const currentCulture = CultureStore.getCurrent();

		const sex = ProfileStore.getSex();

		const list = filterAndSort(professions.filter(e => {
			const typicalList = currentCulture!.typicalProfessions[e.gr - 1];
			const commonVisible = e.id === 'P_0' || (typeof typicalList === 'boolean' ? typicalList === true : (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr) !== typicalList.reverse : typicalList.list.includes(e.id) !== typicalList.reverse));
			const groupVisible = groupVisibility === 0 || e.gr === 0 || groupVisibility === e.gr;
			const extensionVisible = visibility === 'all' || (e.src.id === 'US25001' ? commonVisible : extensionVisibility);
			return groupVisible && extensionVisible;
		}), filterText, sortOrder, sex);

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
						fullWidth
						/>
					<Dropdown
						value={groupVisibility}
						onChange={this.changeGroupVisibility}
						options={[{id: 0, name: 'Alle Professionsgruppen'}, {id: 1, name: 'Weltliche Professionen'}, {id: 2, name: 'Magische Professionen'}, {id: 3, name: 'Geweihte Professionen'}]}
						fullWidth
						/>
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{
								name: 'Alphabetisch',
								value: 'name',
							},
							{
								name: 'Nach Kosten',
								value: 'cost',
							},
						]}
						/>
					<Checkbox checked={extensionVisibility} onClick={this.switchExtensionVisibility}>
						Professionen aus Erweiterungen immer anzeigen
					</Checkbox>
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
