import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
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
import { Culture, UIMessages } from '../../types/view.d';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { CulturesListItem } from './CulturesListItem';

export interface CulturesOwnProps {
	locale: UIMessages;
	switchToProfessions(): void;
}

export interface CulturesStateProps {
	cultures: Culture[];
	currentId?: string;
	sortOrder: string;
	visibilityFilter: string;
}

export interface CulturesDispatchProps {
	selectCulture(id: string): void;
	setSortOrder(sortOrder: string): void;
	setVisibilityFilter(option: string): void;
	switchValueVisibilityFilter(): void;
}

export type CulturesProps = CulturesStateProps & CulturesDispatchProps & CulturesOwnProps;

export interface CulturesState {
	filterText: string;
}

export class Cultures extends React.Component<CulturesProps, CulturesState> {
	state = {
		filterText: ''
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as CulturesState);

	render() {
		const { cultures, locale, setSortOrder, setVisibilityFilter, sortOrder, visibilityFilter } = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(cultures, locale.id, filterText, sortOrder === 'cost' ? ['culturalPackageAp', 'name'] : ['name']);

		return (
			<Page id="cultures">
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={visibilityFilter}
						onChange={setVisibilityFilter}
						options={[{ id: 'all', name: _translate(locale, 'cultures.options.allcultures') }, { id: 'common', name: _translate(locale, 'cultures.options.commoncultures') }]}
						fullWidth
						/>
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
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<Scroll>
						<List>
							{
								list.map(culture =>
									<CulturesListItem
										{...this.props}
										key={culture.id}
										culture={culture}
										/>
								)
							}
						</List>
					</Scroll>
				</MainContent>
				<WikiInfoContainer {...this.props} />
			</Page>
		);
	}
}
