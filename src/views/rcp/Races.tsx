import { filterAndSort } from '../../utils/ListUtils';
import * as RaceActions from '../../actions/RaceActions';
import * as React from 'react';
import Checkbox from '../../components/Checkbox';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import RacesListItem from './RacesListItem';
import RaceStore from '../../stores/RaceStore';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

interface Props {
	changeTab: (tab: string) => void;
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
		races: RaceStore.getAll(),
		currentID: RaceStore.getCurrentID(),
		filterText: '',
		sortOrder: RaceStore.getSortOrder(),
		areValuesVisible: RaceStore.areValuesVisible()
	};

	_updateRaceStore = () => this.setState({
		races: RaceStore.getAll(),
		currentID: RaceStore.getCurrentID(),
		sortOrder: RaceStore.getSortOrder(),
		areValuesVisible: RaceStore.areValuesVisible()
	} as State);

	filter = (event: Event) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => RaceActions.setRacesSortOrder(option);
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
							{ name: 'Nach Kosten', value: 'cost' }
						]}
						/>
					<Checkbox checked={areValuesVisible} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							list.map(race => <RacesListItem
								key={race.id}
								changeTab={this.props.changeTab.bind(null, 'culture')}
								currentID={currentID}
								race={race}
								showDetails={areValuesVisible}
								/>
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}
