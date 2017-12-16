import { ReceiveInitialDataAction } from '../actions/IOActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { ToListById } from '../types/data';
import { RawAdvantage, RawAdvantageLocale, RawAttribute, RawAttributeLocale, RawBlessing, RawBlessingLocale, RawCantrip, RawCantripLocale, RawCombatTechnique, RawCombatTechniqueLocale, RawCulture, RawCultureLocale, RawDisadvantage, RawDisadvantageLocale, RawLiturgy, RawLiturgyLocale, RawProfession, RawProfessionLocale, RawProfessionVariant, RawProfessionVariantLocale, RawRace, RawRaceLocale, RawRaceVariant, RawRaceVariantLocale, RawSpecialAbility, RawSpecialAbilityLocale, RawSpell, RawSpellLocale, RawTalent, RawTalentLocale } from '../types/rawdata';
import { Advantage, Attribute, Blessing, Book, Cantrip, CombatTechnique, Culture, Disadvantage, ExperienceLevel, ItemTemplate, LiturgicalChant, Profession, ProfessionVariant, Race, RaceVariant, SelectionObject, Skill, SkillishEntry, SpecialAbility, Spell } from '../types/wiki';
import { _translate } from '../utils/I18n';
import { getWikiStateKeyByCategory } from '../utils/IDUtils';
import { initAdvantage, initAttribute, initBlessing, initCantrip, initCombatTechnique, initCulture, initDisadvantage, initExperienceLevel, initItemTemplate, initLiturgicalChant, initProfession, initProfessionVariant, initRace, initRaceVariant, initSkill, initSpecialAbility, initSpell } from '../utils/InitWikiUtils';

type Action = ReceiveInitialDataAction;

type Data = Book | ExperienceLevel | Race | RaceVariant | Culture | Profession | ProfessionVariant | Attribute | Advantage | Disadvantage | SpecialAbility | Skill | CombatTechnique | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate;

type RawData = RawAdvantage | RawAttribute | RawBlessing | RawCantrip | RawCombatTechnique | RawCulture | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawRaceVariant | RawSpecialAbility | RawSpell | RawTalent;

type RawLocales = RawAdvantageLocale | RawAttributeLocale | RawBlessingLocale | RawCantripLocale | RawCombatTechniqueLocale | RawDisadvantageLocale | RawLiturgyLocale | RawProfessionLocale | RawProfessionVariantLocale | RawRaceLocale | RawRaceVariantLocale | RawCultureLocale | RawSpecialAbilityLocale | RawSpellLocale | RawTalentLocale;

export interface WikiState {
	books: Map<string, Book>;
	experienceLevels: Map<string, ExperienceLevel>;
	races: Map<string, Race>;
	raceVariants: Map<string, RaceVariant>;
	cultures: Map<string, Culture>;
	professions: Map<string, Profession>;
	professionVariants: Map<string, ProfessionVariant>;
	attributes: Map<string, Attribute>;
	advantages: Map<string, Advantage>;
	disadvantages: Map<string, Disadvantage>;
	specialAbilities: Map<string, SpecialAbility>;
	skills: Map<string, Skill>;
	combatTechniques: Map<string, CombatTechnique>;
	spells: Map<string, Spell>;
	cantrips: Map<string, Cantrip>;
	liturgicalChants: Map<string, LiturgicalChant>;
	blessings: Map<string, Blessing>;
	itemTemplates: Map<string, ItemTemplate>;
}

const initialState: WikiState = {
	books: new Map(),
	experienceLevels: new Map(),
	races: new Map(),
	raceVariants: new Map(),
	cultures: new Map(),
	professions: new Map(),
	professionVariants: new Map(),
	attributes: new Map(),
	advantages: new Map(),
	disadvantages: new Map(),
	specialAbilities: new Map(),
	skills: new Map(),
	combatTechniques: new Map(),
	spells: new Map(),
	cantrips: new Map(),
	liturgicalChants: new Map(),
	blessings: new Map(),
	itemTemplates: new Map(),
};

export function wiki(state: WikiState = initialState, action: Action): WikiState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA: {
			const { config, defaultLocale, locales, tables } = action.payload;
			const localeId = config && config.locale || defaultLocale;
			const rawLocale = locales[localeId];
			const { books, ui } = rawLocale;
			const { attributes, advantages, blessings, cantrips, cultures, disadvantages, el, talents, combattech, professions, professionvariants, races, racevariants, spells, liturgies, specialabilities, items } = tables;

			const iterate = <R extends RawData, T extends Data, L extends RawLocales>(source: { [id: string]: R }, initFn: (raw: R, locale: ToListById<L>) => T | undefined, locale: ToListById<L>): Map<string, T> => {
				return Object.entries(source).reduce((map, [id, obj]) => {
					const result = initFn(obj, locale);
					if (result) {
						map.set(id, result);
					}
					return map;
				}, new Map<string, T>());
			};

			const list: WikiState = {
				books: new Map(Object.entries(books)),
				experienceLevels: iterate(el, initExperienceLevel, rawLocale.el),
				races: iterate(races, initRace, rawLocale.races),
				raceVariants: iterate(racevariants, initRaceVariant, rawLocale.racevariants),
				cultures: iterate(cultures, initCulture, rawLocale.cultures),
				professions: iterate(professions, initProfession, rawLocale.professions),
				professionVariants: iterate(professionvariants, initProfessionVariant, rawLocale.professionvariants),
				attributes: iterate(attributes, initAttribute, rawLocale.attributes),
				advantages: iterate(advantages, initAdvantage, rawLocale.advantages),
				disadvantages: iterate(disadvantages, initDisadvantage, rawLocale.disadvantages),
				specialAbilities: iterate(specialabilities, initSpecialAbility, rawLocale.specialabilities),
				skills: iterate(talents, initSkill, rawLocale.talents),
				combatTechniques: iterate(combattech, initCombatTechnique, rawLocale.combattech),
				spells: iterate(spells, initSpell, rawLocale.spells),
				cantrips: iterate(cantrips, initCantrip, rawLocale.cantrips),
				liturgicalChants: iterate(liturgies, initLiturgicalChant, rawLocale.liturgies),
				blessings: iterate(blessings, initBlessing, rawLocale.blessings),
				itemTemplates: iterate(items, initItemTemplate, rawLocale.items),
			};

			const ownProfession = initProfession({
				ap: 0,
				apOfActivatables: 0,
				chants: [],
				combattech: [],
				id: 'P_0',
				pre_req: [],
				req: [],
				sa: [],
				sel: [],
				blessings: [],
				spells: [],
				talents: [],
				typ_adv: [],
				typ_dadv: [],
				untyp_adv: [],
				untyp_dadv: [],
				vars: [],
				gr: 0,
				sgr: 0,
				src: []
			}, {
				P_0: {
					id: 'P_0',
					name: _translate(ui, 'professions.ownprofession'),
					req: [],
					src: []
				}
			});
			if (ownProfession) {
				list.professions.set('P_0', ownProfession);
			}

			function getSelectionCategories(source: SelectionObject[]) {
				const rawNames = source.reduce<SkillishEntry[]>((arr, e) => {
					const key = getWikiStateKeyByCategory(e.id as Categories.Category);
					if (key) {
						return [...arr, ...list[key].values()] as SkillishEntry[];
					}
					return arr;
				}, []);
				const mapped = rawNames.map(({ id, name, ic }) => ({ id, name, cost: ic }));
				mapped.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
				return mapped;
			}

			for (const [id, obj] of list.advantages as Map<string, Advantage>) {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47'].includes(id) && obj.select) {
					// @ts-ignore
					obj.select = getSelectionCategories(obj.select);
				}
				list.advantages.set(id, obj);
			}

			for (const [id, obj] of list.disadvantages as Map<string, Disadvantage>) {
				if (['DISADV_48'].includes(id) && obj.select) {
					// @ts-ignore
					obj.select = getSelectionCategories(obj.select);
				}
				list.disadvantages.set(id, obj);
			}

			for (const [id, obj] of list.specialAbilities as Map<string, SpecialAbility>) {
				if (['SA_231', 'SA_250', 'SA_562', 'SA_569'].includes(id) && obj.select) {
					// @ts-ignore
					obj.select = getSelectionCategories(obj.select);
				}
				else if (['SA_472', 'SA_473', 'SA_531', 'SA_533'].includes(id) && obj.select) {
					// @ts-ignore
					obj.select = [...state.skills.values()].filter(e => e.gr === 4).map(({ id, name, ic }) => ({ id, name, cost: ic }));
				}
				else if (id === 'SA_258' && obj.select) {
					// @ts-ignore
					obj.select = getSelectionCategories(obj.select);
				}
				else if (id === 'SA_60') {
					// @ts-ignore
					obj.select = obj.select!.map(e => {
						const entry = list.combatTechniques.get(e.name);
						return { ...e, name: entry ? entry.name as string : '...' };
					});
				}
				else if (id === 'SA_9') {
					// @ts-ignore
					obj.select = [...list.skills.values()].map(talent => {
						const { id, name, ic, applications, applicationsInput } = talent;
						return {
							id,
							name,
							cost: ic,
							applications,
							applicationsInput,
						};
					});
				}
				list.specialAbilities.set(id, obj);
			}

			return list;
		}

		default:
			return state;
	}
}
