import * as React from 'react';
import * as RaceActions from '../../actions/RaceActions';
import { Checkbox } from '../../components/Checkbox';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { RaceStore } from '../../stores/RaceStore';
import { InputTextEvent, RaceInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { filterAndSort } from '../../utils/ListUtils';
import { RacesListItem } from './RacesListItem';

interface Props {
	changeTab(tab: string): void;
}

interface State {
	races: RaceInstance[];
	currentID?: string;
	filterText: string;
	sortOrder: string;
	areValuesVisible: boolean;
}

export class Races extends React.Component<Props, State> {
	state = {
		areValuesVisible: RaceStore.areValuesVisible(),
		currentID: RaceStore.getCurrentID(),
		filterText: '',
		races: RaceStore.getAll(),
		sortOrder: RaceStore.getSortOrder(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => RaceActions.setRacesSortOrder(option);
	changeTab = () => this.props.changeTab('culture');
	changeValueVisibility = () => RaceActions.switchRaceValueVisibilityFilter();

	componentDidMount() {
		RaceStore.addChangeListener(this.updateRaceStore);
	}

	componentWillUnmount() {
		RaceStore.removeChangeListener(this.updateRaceStore);
	}

	render() {
		const { currentID, filterText, races, areValuesVisible, sortOrder } = this.state;

		const list = filterAndSort(races, filterText, sortOrder);

		return (
			<div className="page" id="races">
				<div className="options">
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						sortOrder={sortOrder}
						sort={this.sort}
						options={['name', 'cost']}
						/>
					<Checkbox checked={areValuesVisible} onClick={this.changeValueVisibility}>{translate('rcp.options.showvalues')}</Checkbox>
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

	private updateRaceStore = () => {
			this.setState({
			areValuesVisible: RaceStore.areValuesVisible(),
			currentID: RaceStore.getCurrentID(),
			races: RaceStore.getAll(),
			sortOrder: RaceStore.getSortOrder(),
		} as State);
	}
}
