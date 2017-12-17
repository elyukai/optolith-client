import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { AdvantageInstance, DisadvantageInstance, SpecialAbilityInstance } from '../../types/data';
import { UIMessages } from '../../types/ui.d';
import { Blessing, Cantrip, CombatTechnique, Culture, ItemTemplate, LiturgicalChant, Profession, Race, Skill, Spell } from '../../types/wiki';
import { _translate } from '../../utils/I18n';
import { WikiList } from './WikiList';

export interface WikiOwnProps {
	locale: UIMessages;
}

interface Lists {
	races: Race[];
	cultures: Culture[];
	professions: Profession[];
	advantages: AdvantageInstance[];
	disadvantages: DisadvantageInstance[];
	skills: Skill[];
	combatTechniques: CombatTechnique[];
	specialAbilities: SpecialAbilityInstance[];
	spells: Spell[];
	cantrips: Cantrip[];
	liturgicalChants: LiturgicalChant[];
	blessings: Blessing[];
	itemTemplates: ItemTemplate[];
}

export interface WikiStateProps extends Lists {
	filterText: string;
	category1: string | undefined;
	category2: string | undefined;
}

export interface WikiDispatchProps {
	setCategory1(category: string): void;
	setCategory2(category: string): void;
	setFilter(filterText: string): void;
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export interface WikiState {
	infoId?: string;
}

export class Wiki extends React.Component<WikiProps, WikiState> {
	state: WikiState = {};

	showInfo = (id: string) => this.setState({ infoId: id } as WikiState);

	render() {
		const { category1, category2, filterText, locale, setCategory1, setCategory2, setFilter, ...other } = this.props;
		const { infoId } = this.state;

		const list: (Race | Culture | Profession | AdvantageInstance | DisadvantageInstance | Skill | CombatTechnique | SpecialAbilityInstance | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate)[] | undefined = typeof category1 === 'string' ? other[category1 as keyof Lists] : undefined;

		return (
			<Page id="wiki">
				<Options>
					<TextField
						hint={_translate(locale, 'options.filtertext')}
						onChange={e => setFilter(e.target.value)}
						value={filterText}
						/>
					<Dropdown
						value={category1}
						onChange={setCategory1}
						options={[
							{id: 'races', name: _translate(locale, 'charactersheet.main.race')},
							{id: 'cultures', name: _translate(locale, 'charactersheet.main.culture')},
							{id: 'professions', name: _translate(locale, 'charactersheet.main.profession')},
							{id: 'advantages', name: _translate(locale, 'charactersheet.main.advantages')},
							{id: 'disadvantages', name: _translate(locale, 'charactersheet.main.disadvantages')},
							{id: 'skills', name: _translate(locale, 'charactersheet.gamestats.skills.title')},
							{id: 'combatTechniques', name: _translate(locale, 'info.combattechniques')},
							{id: 'specialAbilities', name: _translate(locale, 'info.specialabilities')},
							{id: 'spells', name: _translate(locale, 'charactersheet.spells.title')},
							{id: 'cantrips', name: _translate(locale, 'charactersheet.spells.cantrips.title')},
							{id: 'liturgicalChants', name: _translate(locale, 'titlebar.tabs.liturgies')},
							{id: 'blessings', name: _translate(locale, 'charactersheet.chants.blessings.title')},
							{id: 'itemTemplates', name: _translate(locale, 'itemeditor.options.template')},
						]}
						/>
				</Options>
				<MainContent>
					<Scroll>
						{list && <WikiList list={list} showInfo={this.showInfo} currentInfoId={infoId} />}
					</Scroll>
				</MainContent>
				<WikiInfoContainer {...this.props} currentId={infoId}/>
			</Page>
		);
	}
}
