import * as React from 'react';
import { Aside } from '../../components/Aside';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { InputTextEvent } from '../../types/data.d';
import { Race, UIMessages } from '../../types/view.d';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { RacesListItem } from './RacesListItem';
import { RaceVariants } from './RaceVariants';

export interface RacesOwnProps {
	locale: UIMessages;
	switchToCultures(): void;
}

export interface RacesStateProps {
	currentId?: string;
	currentVariantId?: string;
	races: Race[];
	sortOrder: string;
}

export interface RacesDispatchProps {
	selectRace(id: string): void;
	selectRaceVariant(id: string, variantId?: string): void;
	setSortOrder(sortOrder: string): void;
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

	render() {
		const { locale, races, setSortOrder, sortOrder } = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(races, locale.id, filterText, sortOrder === 'cost' ? ['ap', 'name'] : ['name']);

		return (
			<Page id="races">
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						sortOrder={sortOrder}
						sort={setSortOrder}
						options={['name', 'cost']}
						locale={locale}
						/>
				</Options>
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="cost" hint={_translate(locale, 'aptext')}>
							{_translate(locale, 'apshort')}
						</ListHeaderTag>
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder has-border" />
					</ListHeader>
					<Scroll>
						<List>
							{
								list.map(race =>
									<RacesListItem {...this.props} key={race.id} race={race} />
								)
							}
						</List>
					</Scroll>
				</MainContent>
				<Aside>
					<RaceVariants {...this.props} />
					<WikiInfoContainer {...this.props} noWrapper />
				</Aside>
			</Page>
		);
	}
}
