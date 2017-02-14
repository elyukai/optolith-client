import { filterAndSort } from '../../utils/ListUtils';
import * as CultureActions from '../../actions/CultureActions';
import * as React from 'react';
import Checkbox from '../../components/Checkbox';
import CulturesListItem from './CulturesListItem';
import CultureStore from '../../stores/CultureStore';
import Dropdown from '../../components/Dropdown';
import RaceStore from '../../stores/RaceStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

interface Props {
	changeTab: (tab: string) => void;
}

interface State {
	cultures: CultureInstance[];
	currentID: string | null;
	filterText: string;
	sortOrder: string;
	showDetails: boolean;
	visibilityFilter: string;
}

export default class Cultures extends React.Component<Props, State> {
	state = {
		cultures: CultureStore.getAll(),
		currentID: CultureStore.getCurrentID(),
		filterText: '',
		sortOrder: CultureStore.getSortOrder(),
		showDetails: CultureStore.areValuesVisible(),
		visibilityFilter: CultureStore.areAllVisible()
	};

	_updateCultureStore = () => this.setState({
		cultures: CultureStore.getAll(),
		currentID: CultureStore.getCurrentID(),
		sortOrder: CultureStore.getSortOrder(),
		showDetails: CultureStore.areValuesVisible(),
		visibilityFilter: CultureStore.areAllVisible()
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => CultureActions.setSortOrder(option);
	changeValueVisibility = () => CultureActions.switchValueVisibilityFilter();
	changeView = (view: string) => CultureActions.setVisibilityFilter(view);

	componentDidMount() {
		CultureStore.addChangeListener(this._updateCultureStore);
	}

	componentWillUnmount() {
		CultureStore.removeChangeListener(this._updateCultureStore);
	}

	render() {
		const { currentID, filterText, cultures, visibilityFilter, showDetails, sortOrder } = this.state;

		const currentRace = RaceStore.getCurrent();

		const list = filterAndSort(cultures.filter(e => visibilityFilter === 'all' || currentRace.typicalCultures.includes(e.id)), filterText, sortOrder);

		return (
			<div className="page" id="cultures">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibilityFilter}
						onChange={this.changeView}
						options={[{ id: 'all', name: 'Alle Kulturen' }, { id: 'common', name: 'Übliche Kulturen' }]}
						fullWidth
						/>
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Nach Kosten', value: 'cost' }
						]}
						/>
					<Checkbox checked={showDetails} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
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
								/>
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}
