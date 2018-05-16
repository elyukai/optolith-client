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
import { translate } from '../../utils/I18n';
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
						hint={translate(locale, 'options.filtertext')}
						onChange={e => setFilter(e.target.value)}
						value={filterText}
						/>
					<Dropdown
						value={category}
						onChange={setCategory1}
						hint={translate(locale, 'wiki.chooseacategory')}
						options={[
							{id: 'races', name: translate(locale, 'races')},
							{id: 'cultures', name: translate(locale, 'cultures')},
							{id: 'professions', name: translate(locale, 'professions')},
							{id: 'advantages', name: translate(locale, 'advantages')},
							{id: 'disadvantages', name: translate(locale, 'disadvantages')},
							{id: 'skills', name: translate(locale, 'skills')},
							{id: 'combatTechniques', name: translate(locale, 'combattechniques')},
							{id: 'specialAbilities', name: translate(locale, 'specialabilities')},
							{id: 'spells', name: translate(locale, 'spells')},
							{id: 'cantrips', name: translate(locale, 'cantrips')},
							{id: 'liturgicalChants', name: translate(locale, 'liturgicalChants')},
							{id: 'blessings', name: translate(locale, 'blessings')},
							{id: 'itemTemplates', name: translate(locale, 'items')},
						]}
						/>
					{category === 'professions' && <Dropdown
						value={professionsGroup}
						onChange={setProfessionsGroup}
						options={[
							{
								name: translate(locale, 'professions.options.allprofessiongroups')
							},
							{
								id: 1,
								name: translate(locale, 'professions.options.mundaneprofessions')
							},
							{
								id: 2,
								name: translate(locale, 'professions.options.magicalprofessions')
							},
							{
								id: 3,
								name: translate(locale, 'professions.options.blessedprofessions')
							}
						]}
						fullWidth
						/>}
					{category === 'skills' && <Dropdown
						value={skillsGroup}
						onChange={setSkillsGroup}
						options={[
							{
								name: translate(locale, 'allskillgroups')
							},
							...sortObjects(translate(locale, 'skills.view.groups').map((name, index) => ({
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
								name: translate(locale, 'allcombattechniquegroups')
							},
							...sortObjects(translate(locale, 'combattechniques.view.groups').map((name, index) => ({
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
								name: translate(locale, 'allspecialabilitygroups')
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
								name: translate(locale, 'allspellgroups')
							},
							...sortObjects(translate(locale, 'spells.view.groups').map((name, index) => ({
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
								name: translate(locale, 'allliturgicalchantgroups')
							},
							...sortObjects(translate(locale, 'liturgies.view.groups').map((name, index) => ({
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
								name: translate(locale, 'allitemtemplategroups')
							},
							...sortObjects(translate(locale, 'equipment.view.groups').map((name, index) => ({
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
