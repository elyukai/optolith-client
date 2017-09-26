import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { InputTextEvent } from '../../types/data.d';
import { Race, UIMessages } from '../../types/view.d';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { RacesListItem } from './RacesListItem';

export interface RacesOwnProps {
	locale: UIMessages;
	switchToCultures(): void;
}

export interface RacesStateProps {
	areValuesVisible: boolean;
	currentId?: string;
	races: Race[];
	sortOrder: string;
}

export interface RacesDispatchProps {
	selectRace(id: string): void;
	setSortOrder(sortOrder: string): void;
	switchValueVisibilityFilter(): void;
}

export type RacesProps = RacesStateProps & RacesDispatchProps & RacesOwnProps;

export interface RacesState {
	filterText: string;
}

export class Races extends React.Component<RacesProps, RacesState> {
	state = {
		filterText: ''
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as RacesState);
	sort = (option: string) => this.props.setSortOrder(option);
	changeValueVisibility = () => this.props.switchValueVisibilityFilter();

	render() {
		const { areValuesVisible, locale, races, setSortOrder, sortOrder } = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(races, locale.id, filterText, sortOrder === 'cost' ? ['ap', 'name'] : ['name']);

		return (
			<div className="page" id="races">
				<div className="options">
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						sortOrder={sortOrder}
						sort={setSortOrder}
						options={['name', 'cost']}
						locale={locale}
						/>
					<Checkbox checked={areValuesVisible} onClick={this.changeValueVisibility}>{_translate(locale, 'races.options.showvalues')}</Checkbox>
				</div>
				<Scroll>
					<List>
						{
							list.map(race =>
								<RacesListItem {...this.props} key={race.id} race={race} />
							)
						}
					</List>
				</Scroll>
				<WikiInfoContainer {...this.props} list={races} />
			</div>
		);
	}
}
