import * as React from 'react';
import * as CultureActions from '../../actions/CultureActions';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { CultureStore } from '../../stores/CultureStore';
import { RaceStore } from '../../stores/RaceStore';
import { CultureInstance, InputTextEvent } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { CulturesListItem } from './CulturesListItem';

interface Props {
	changeTab(tab: string): void;
}

interface State {
	cultures: CultureInstance[];
	currentID?: string;
	filterText: string;
	sortOrder: string;
	showDetails: boolean;
	visibilityFilter: string;
}

export class Cultures extends React.Component<Props, State> {
	state = {
		cultures: CultureStore.getAll(),
		currentID: CultureStore.getCurrentID(),
		filterText: '',
		showDetails: CultureStore.areValuesVisible(),
		sortOrder: CultureStore.getSortOrder(),
		visibilityFilter: CultureStore.areAllVisible(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => CultureActions.setSortOrder(option);
	changeTab = () => this.props.changeTab('profession');
	changeValueVisibility = () => CultureActions.switchValueVisibilityFilter();
	changeView = (view: string) => CultureActions.setVisibilityFilter(view);

	componentDidMount() {
		CultureStore.addChangeListener(this.updateCultureStore);
	}

	componentWillUnmount() {
		CultureStore.removeChangeListener(this.updateCultureStore);
	}

	render() {
		const { currentID, filterText, cultures, visibilityFilter, showDetails, sortOrder } = this.state;

		const currentRace = RaceStore.getCurrent();

		const list = filterAndSort(cultures.filter(e => visibilityFilter === 'all' || currentRace!.commonCultures.includes(e.id)), filterText, sortOrder);

		return (
			<div className="page" id="cultures">
				<div className="options">
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibilityFilter}
						onChange={this.changeView}
						options={[{ id: 'all', name: translate('cultures.options.allcultures') }, { id: 'common', name: translate('cultures.options.commoncultures') }]}
						fullWidth
						/>
					<SortOptions
						sortOrder={sortOrder}
						sort={this.sort}
						options={['name', 'cost']}
						/>
					<Checkbox checked={showDetails} onClick={this.changeValueVisibility}>{translate('cultures.options.showculturalpackagevalues')}</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							list.map(culture => <CulturesListItem
								key={culture.id}
								changeTab={this.props.changeTab.bind(null, 'profession')}
								currentID={currentID}
								culture={culture}
								showDetails={showDetails}
								/>,
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}

	private updateCultureStore = () => {
		this.setState({
			cultures: CultureStore.getAll(),
			currentID: CultureStore.getCurrentID(),
			showDetails: CultureStore.areValuesVisible(),
			sortOrder: CultureStore.getSortOrder(),
			visibilityFilter: CultureStore.areAllVisible(),
		} as State);
	}
}
