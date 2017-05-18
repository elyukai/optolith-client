import * as React from 'react';
import * as ProfessionActions from '../../actions/ProfessionActions';
import * as ProfessionVariantActions from '../../actions/ProfessionVariantActions';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { CultureStore } from '../../stores/CultureStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { InputTextEvent, ProfessionInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
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

export class Professions extends React.Component<{}, State> {
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

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => ProfessionActions.setProfessionsSortOrder(option);
	changeView = (view: string) => ProfessionActions.setProfessionsVisibilityFilter(view);
	changeGroupVisibility = (id: number) => ProfessionActions.setProfessionsGroupVisibilityFilter(id);
	switchExtensionVisibility = () => ProfessionActions.switchProfessionsExpansionVisibilityFilter();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	selectProfessionVariant = (id?: string) => ProfessionVariantActions.selectProfessionVariant(id);

	componentDidMount() {
		ProfessionStore.addChangeListener(this.updateProfessionStore);
		ProfessionVariantStore.addChangeListener(this.updateProfessionVariantStore);
	}

	componentWillUnmount() {
		ProfessionStore.removeChangeListener(this.updateProfessionStore);
		ProfessionVariantStore.removeChangeListener(this.updateProfessionVariantStore);
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
			if (e.id === 'P_17') {
				console.log(typicalList, commonVisible, groupVisible, extensionVisible, groupVisible && extensionVisible);
			}
			return groupVisible && extensionVisible;
		}), filterText, sortOrder, sex);

		return (
			<div className="page" id="professions">
				{
					showAddSlidein ? <Selections close={this.hideAddSlidein} /> : null
				}
				<div className="options">
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibility}
						onChange={this.changeView}
						options={[{id: 'all', name: translate('professions.options.allprofessions')}, {id: 'common', name: translate('professions.options.commonprofessions')}]}
						fullWidth
						/>
					<Dropdown
						value={groupVisibility}
						onChange={this.changeGroupVisibility}
						options={[{id: 0, name: translate('professions.options.allprofessiongroups')}, {id: 1, name: translate('professions.options.mundaneprofessions')}, {id: 2, name: translate('professions.options.magicalprofessions')}, {id: 3, name: translate('professions.options.blessedprofessions')}]}
						fullWidth
						/>
					<SortOptions
						sortOrder={sortOrder}
						sort={this.sort}
						options={['name', 'cost']}
						/>
					<Checkbox checked={extensionVisibility} onClick={this.switchExtensionVisibility}>
						{translate('professions.options.alwaysshowprofessionsfromextensions')}
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

	private updateProfessionStore = () => {
		this.setState({
			currentID: ProfessionStore.getCurrentId(),
			professions: ProfessionStore.getAllValid(),
			sortOrder: ProfessionStore.getSortOrder(),
			visibility: ProfessionStore.getVisibilityFilter(),
			groupVisibility: ProfessionStore.getGroupVisibilityFilter(),
			extensionVisibility: ProfessionStore.getExpansionVisibilityFilter()
		} as State);
	}

	private updateProfessionVariantStore = () => {
		this.setState({
			currentVID: ProfessionVariantStore.getCurrentID(),
		} as State);
	}
}
