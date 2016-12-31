import Checkbox from '../../components/Checkbox';
import { filterAndSort } from '../../utils/ListUtils';
import { RaceInstance } from '../../utils/data/Race';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import RaceActions from '../../actions/RaceActions';
import RacesListItem from './RacesListItem';
import RaceStore from '../../stores/RaceStore';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

interface Props {
	changeTab: (tab: string) => void;
}

interface State {
	races: RaceInstance[];
	currentID: string;
	filterText: string;
	sortOrder: string;
	showDetails: boolean;
}

const getRaceStore = () => ({
	races: RaceStore.getAll(),
	currentID: RaceStore.getCurrentID(),
	filterText: RaceStore.getFilter(),
	sortOrder: RaceStore.getSortOrder(),
	showDetails: RaceStore.areValuesVisible()
} as State);

export default class Races extends Component<Props, State> {

	static propTypes = {
		changeTab: PropTypes.func
	};

	state = getRaceStore();
	
	_updateRaceStore = () => this.setState(getRaceStore());

	filter = event => RaceActions.filter(event.target.value);
	sort = option => RaceActions.sort(option);
	changeValueVisibility = () => RaceActions.changeValueVisibility();
	
	componentDidMount() {
		RaceStore.addChangeListener(this._updateRaceStore);
	}
	
	componentWillUnmount() {
		RaceStore.removeChangeListener(this._updateRaceStore);
	}

	render() {

		const { currentID, filterText, races, showDetails, sortOrder } = this.state;

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
					<Checkbox checked={showDetails} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							list.map(race => <RacesListItem
								key={race.id}
								changeTab={this.props.changeTab.bind(null, 'culture')}
								currentID={currentID}
								race={race}
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
