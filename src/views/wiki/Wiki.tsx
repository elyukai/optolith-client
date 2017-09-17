import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Dropdown } from '../../components/Dropdown';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { UIMessages } from '../../types/ui.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiOwnProps {
	locale: UIMessages;
}

export interface WikiStateProps {
	filterText: string;
	filterAllText: string;
	category1: string;
	category2: string;
}

export interface WikiDispatchProps {
	setCategory1(category: string): void;
	setCategory2(category: string): void;
	setFilter(filterText: string): void;
	setFilterAll(filterText: string): void;
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export function Wiki(props: WikiProps) {
	const { category1, category2, filterText, locale, setCategory1, setCategory2, setFilter } = props;
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
				<Scroll>
					{category1 === 'magic' && typeof category2 === 'string' ? 'Culpa non dolor aliquip excepteur id tempor eiusmod non exercitation anim.' : ''}
				</Scroll>
				<Aside>

				</Aside>
			</Page>
		</section>
	);
}
