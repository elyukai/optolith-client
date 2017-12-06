import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { ListItem } from '../../components/ListItem';
import { ListItemName } from '../../components/ListItemName';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { UIMessages } from '../../types/ui.d';
import { Profession } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiOwnProps {
	locale: UIMessages;
}

export interface WikiStateProps {
	filterText: string;
	filterAllText: string;
	category1: string | undefined;
	category2: string | undefined;
	professions: Profession[];
	sex: 'm' | 'f';
}

export interface WikiDispatchProps {
	setCategory1(category: string): void;
	setCategory2(category: string): void;
	setFilter(filterText: string): void;
	setFilterAll(filterText: string): void;
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export interface WikiState {
	infoId?: string;
}

export class Wiki extends React.Component<WikiProps, WikiState> {
	state: WikiState = {};

	showInfo = (id: string) => this.setState({ infoId: id } as WikiState);

	render() {
		const { category1, category2, filterText, locale, setCategory1, setCategory2, setFilter, professions, sex } = this.props;
		const { infoId } = this.state;
		return (
			<section id="wiki">
				<Page>
					<Options>
						<TextField
							hint={_translate(locale, 'options.filtertext')}
							onChange={e => setFilter(e.target.result)}
							value={filterText}
							/>
						<Dropdown
							value={category1}
							onChange={setCategory1}
							options={[
								{id: 'magic', name: _translate(locale, 'wiki.category.magic')}
							]}
							/>
						{category1 === 'magic' && (
							<Dropdown
								value={category2}
								onChange={setCategory2}
								options={sortObjects([
									{id: 'spells', name: _translate(locale, 'wiki.category.spells')},
									{id: 'rituals', name: _translate(locale, 'wiki.category.rituals')},
									{id: 'cantrips', name: _translate(locale, 'wiki.category.cantrips')},
									{id: 'curses', name: _translate(locale, 'wiki.category.curses')},
									{id: 'elvenmagicalsongs', name: _translate(locale, 'wiki.category.elvenmagicalsongs')},
									{id: 'magicalmelodies', name: _translate(locale, 'wiki.category.magicalmelodies')},
									{id: 'magicaldances', name: _translate(locale, 'wiki.category.magicaldances')}
								].filter(e => typeof e.name === 'string'), locale.id)}
								/>
						)}
					</Options>
					<MainContent>
						<Scroll>
							<List>
								{
									professions.map(profession => {
										const { name, subname } = profession;

										let fullName = '';

										if (typeof name === 'string') {
											fullName = name;
										}
										else {
											fullName = name.m;
										}

										if (typeof subname === 'string') {
											fullName += ` (${subname})`;
										}
										else if (typeof subname === 'object') {
											fullName += ` (${subname.m})`;
										}

										return (
											<ListItem
												key={profession.id}
												active={profession.id === infoId}
												onClick={() => this.showInfo(profession.id)}
												>
												<ListItemName name={fullName} />
											</ListItem>
										);
									})
								}
							</List>
						</Scroll>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={infoId}/>
				</Page>
			</section>
		);
	}
}
