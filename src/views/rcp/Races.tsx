import * as React from 'react';
import * as RaceActions from '../../actions/RaceActions';
import Checkbox from '../../components/Checkbox';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import RaceStore from '../../stores/RaceStore';
import { filterAndSort } from '../../utils/ListUtils';
import RacesListItem from './RacesListItem';

interface Props {
	changeTab(tab: string): void;
}

interface State {
	races: RaceInstance[];
	currentID: string | null;
	filterText: string;
	sortOrder: string;
	areValuesVisible: boolean;
}

export default class Races extends React.Component<Props, State> {
	state = {
		areValuesVisible: RaceStore.areValuesVisible(),
		currentID: RaceStore.getCurrentID(),
		filterText: '',
		races: RaceStore.getAll(),
		sortOrder: RaceStore.getSortOrder(),
	};

	_updateRaceStore = () => this.setState({
		areValuesVisible: RaceStore.areValuesVisible(),
		currentID: RaceStore.getCurrentID(),
		races: RaceStore.getAll(),
		sortOrder: RaceStore.getSortOrder(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => RaceActions.setRacesSortOrder(option);
	changeTab = () => this.props.changeTab('culture');
	changeValueVisibility = () => RaceActions.switchRaceValueVisibilityFilter();

	componentDidMount() {
		RaceStore.addChangeListener(this._updateRaceStore);
	}

	componentWillUnmount() {
		RaceStore.removeChangeListener(this._updateRaceStore);
	}

	render() {

		const { currentID, filterText, races, areValuesVisible, sortOrder } = this.state;

		const list = filterAndSort(races, filterText, sortOrder);

		return (
			<div className="page" id="races">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Nach Kosten', value: 'cost' },
						]}
						/>
					<Checkbox checked={areValuesVisible} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							list.map(race => <RacesListItem
								key={race.id}
								changeTab={this.changeTab}
								currentID={currentID}
								race={race}
								showDetails={areValuesVisible}
								/>,
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}
