import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { UIMessages } from '../../types/ui.d';
import { Advantage, Blessing, Cantrip, CombatTechnique, Culture, Disadvantage, ItemTemplate, LiturgicalChant, Profession, Race, Skill, SpecialAbility, Spell } from '../../types/wiki';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { WikiList } from './WikiList';

export interface WikiOwnProps {
	locale: UIMessages;
}

interface Lists {
	races: Race[];
	cultures: Culture[];
	professions: Profession[];
	advantages: Advantage[];
	disadvantages: Disadvantage[];
	skills: Skill[];
	combatTechniques: CombatTechnique[];
	specialAbilities: SpecialAbility[];
	spells: Spell[];
	cantrips: Cantrip[];
	liturgicalChants: LiturgicalChant[];
	blessings: Blessing[];
	itemTemplates: ItemTemplate[];
}

export interface WikiStateProps extends Lists {
	filterText: string;
	category: string | undefined;
	professionsGroup?: number;
	skillsGroup?: number;
	combatTechniquesGroup?: number;
	specialAbilitiesGroup?: number;
	spellsGroup?: number;
	liturgicalChantsGroup?: number;
	itemTemplatesGroup?: number;
	specialAbilityGroups: { id: number; name: string; }[];
}

export interface WikiDispatchProps {
	setCategory1(category: string): void;
	setCategory2(category: string): void;
	setFilter(filterText: string): void;
	setProfessionsGroup(group: number | undefined): void;
	setSkillsGroup(group: number | undefined): void;
	setCombatTechniquesGroup(group: number | undefined): void;
	setSpecialAbilitiesGroup(group: number | undefined): void;
	setSpellsGroup(group: number | undefined): void;
	setLiturgicalChantsGroup(group: number | undefined): void;
	setItemTemplatesGroup(group: number | undefined): void;
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps;

export interface WikiState {
	infoId?: string;
}

export class Wiki extends React.Component<WikiProps, WikiState> {
	state: WikiState = {};

	showInfo = (id: string) => this.setState({ infoId: id } as WikiState);

	render() {
		const { category, filterText, locale, setCategory1, setCategory2, setFilter, professionsGroup, skillsGroup, combatTechniquesGroup, specialAbilitiesGroup, spellsGroup, liturgicalChantsGroup, itemTemplatesGroup, setProfessionsGroup, setSkillsGroup, setCombatTechniquesGroup, setSpecialAbilitiesGroup, setSpellsGroup, setLiturgicalChantsGroup, setItemTemplatesGroup, specialAbilityGroups, ...other } = this.props;
		const { infoId } = this.state;

		const list: (Race | Culture | Profession | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate)[] | undefined = typeof category === 'string' ? other[category as keyof Lists] : undefined;

		return (
			<Page id="wiki">
				<Options>
					<TextField
						hint={_translate(locale, 'options.filtertext')}
						onChange={e => setFilter(e.target.value)}
						value={filterText}
						/>
					<Dropdown
						value={category}
						onChange={setCategory1}
						hint={_translate(locale, 'wiki.chooseacategory')}
						options={[
							{id: 'races', name: _translate(locale, 'races')},
							{id: 'cultures', name: _translate(locale, 'cultures')},
							{id: 'professions', name: _translate(locale, 'professions')},
							{id: 'advantages', name: _translate(locale, 'advantages')},
							{id: 'disadvantages', name: _translate(locale, 'disadvantages')},
							{id: 'skills', name: _translate(locale, 'skills')},
							{id: 'combatTechniques', name: _translate(locale, 'combattechniques')},
							{id: 'specialAbilities', name: _translate(locale, 'specialabilities')},
							{id: 'spells', name: _translate(locale, 'spells')},
							{id: 'cantrips', name: _translate(locale, 'cantrips')},
							{id: 'liturgicalChants', name: _translate(locale, 'liturgicalChants')},
							{id: 'blessings', name: _translate(locale, 'blessings')},
							{id: 'itemTemplates', name: _translate(locale, 'items')},
						]}
						/>
					{category === 'professions' && <Dropdown
						value={professionsGroup}
						onChange={setProfessionsGroup}
						options={[
							{
								name: _translate(locale, 'professions.options.allprofessiongroups')
							},
							{
								id: 1,
								name: _translate(locale, 'professions.options.mundaneprofessions')
							},
							{
								id: 2,
								name: _translate(locale, 'professions.options.magicalprofessions')
							},
							{
								id: 3,
								name: _translate(locale, 'professions.options.blessedprofessions')
							}
						]}
						fullWidth
						/>}
					{category === 'skills' && <Dropdown
						value={skillsGroup}
						onChange={setSkillsGroup}
						options={[
							{
								name: _translate(locale, 'allskillgroups')
							},
							...sortObjects(_translate(locale, 'skills.view.groups').map((name, index) => ({
								id: index + 1,
								name
							})), locale.id)
						]}
						fullWidth
						/>}
					{category === 'combatTechniques' && <Dropdown
						value={combatTechniquesGroup}
						onChange={setCombatTechniquesGroup}
						options={[
							{
								name: _translate(locale, 'allcombattechniquegroups')
							},
							...sortObjects(_translate(locale, 'combattechniques.view.groups').map((name, index) => ({
								id: index + 1,
								name
							})), locale.id)
						]}
						fullWidth
						/>}
					{category === 'specialAbilities' && <Dropdown
						value={specialAbilitiesGroup}
						onChange={setSpecialAbilitiesGroup}
						options={[
							{
								name: _translate(locale, 'allspecialabilitygroups')
							},
							...specialAbilityGroups
						]}
						fullWidth
						/>}
					{category === 'spells' && <Dropdown
						value={spellsGroup}
						onChange={setSpellsGroup}
						options={[
							{
								name: _translate(locale, 'allspellgroups')
							},
							...sortObjects(_translate(locale, 'spells.view.groups').map((name, index) => ({
								id: index + 1,
								name
							})), locale.id)
						]}
						fullWidth
						/>}
					{category === 'liturgicalChants' && <Dropdown
						value={liturgicalChantsGroup}
						onChange={setLiturgicalChantsGroup}
						options={[
							{
								name: _translate(locale, 'allliturgicalchantgroups')
							},
							...sortObjects(_translate(locale, 'liturgies.view.groups').map((name, index) => ({
								id: index + 1,
								name
							})), locale.id)
						]}
						fullWidth
						/>}
					{category === 'itemTemplates' && <Dropdown
						value={itemTemplatesGroup}
						onChange={setItemTemplatesGroup}
						options={[
							{
								name: _translate(locale, 'allitemtemplategroups')
							},
							...sortObjects(_translate(locale, 'equipment.view.groups').map((name, index) => ({
								id: index + 1,
								name
							})), locale.id)
						]}
						fullWidth
						/>}
				</Options>
				<MainContent>
					<Scroll>
						{list ? list.length === 0 ? <ListPlaceholder noResults locale={locale} type="wiki" /> : <WikiList list={list} showInfo={this.showInfo} currentInfoId={infoId} /> : <ListPlaceholder wikiInitial locale={locale} type="wiki" />}
					</Scroll>
				</MainContent>
				<WikiInfoContainer {...this.props} currentId={infoId}/>
			</Page>
		);
	}
}
