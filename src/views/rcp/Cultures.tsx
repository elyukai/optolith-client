import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { InputTextEvent } from '../../types/data.d';
import { Culture, UIMessages } from '../../types/view.d';
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
	filterText: string;
}

export interface CulturesDispatchProps {
	selectCulture(id: string): void;
	setSortOrder(sortOrder: string): void;
	setVisibilityFilter(option: string): void;
	switchValueVisibilityFilter(): void;
	setFilterText(filterText: string): void;
}

export type CulturesProps = CulturesStateProps & CulturesDispatchProps & CulturesOwnProps;

export interface CulturesState {
	filterText: string;
}

export class Cultures extends React.Component<CulturesProps, CulturesState> {
	state = {
		filterText: ''
	};

	filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);

	render() {
		const { cultures, locale, setSortOrder, setVisibilityFilter, sortOrder, visibilityFilter, filterText } = this.props;

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
								cultures.length === 0 ? <ListPlaceholder locale={locale} type="cultures" noResults /> : cultures.map(culture =>
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
