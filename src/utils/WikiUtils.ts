import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import { ActivatableInstance } from '../types/data';
import { Profession as ProfessionView } from '../types/view';
import { Advantage, Blessing, Cantrip, CombatTechnique, CombatTechniquesSelection, Culture, Disadvantage, ItemTemplate, LiturgicalChant, Profession, ProfessionVariant, ProfessionVariantSelection, Race, RaceVariant, RemoveCombatTechniquesSecondSelection, RemoveCombatTechniquesSelection, RemoveSpecializationSelection, Skill, SpecialAbility, Spell } from '../types/wiki';
import { getIdPrefix } from './IDUtils';
import { IdPrefixes } from '../constants/IdPrefixes';

type Element = Race | RaceVariant | Culture | Profession | ProfessionVariant | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate;

export function getWikiEntry<T extends Element = Element>(state: WikiState, id: string): T | undefined {
	const key = getWikiStateKeyById(id);
	const slice = key && state[key];
	return slice && slice.get(id) as T | undefined;
}

export function getWikiStateKeyById(id: string): keyof WikiState | undefined {
  switch (getIdPrefix(id)) {
    case IdPrefixes.ADVANTAGES:
      return 'advantages';
    case IdPrefixes.ATTRIBUTES:
      return 'attributes';
    case IdPrefixes.BLESSINGS:
      return 'blessings';
    case IdPrefixes.CANTRIPS:
      return 'cantrips';
    case IdPrefixes.COMBAT_TECHNIQUES:
      return 'combatTechniques';
    case IdPrefixes.CULTURES:
      return 'cultures';
    case IdPrefixes.DISADVANTAGES:
      return 'disadvantages';
    case IdPrefixes.LITURGIES:
      return 'liturgicalChants';
    case IdPrefixes.PROFESSIONS:
      return 'professions';
    case IdPrefixes.PROFESSION_VARIANTS:
      return 'professionVariants';
    case IdPrefixes.RACES:
      return 'races';
    case IdPrefixes.RACE_VARIANTS:
      return 'raceVariants';
    case IdPrefixes.SPECIAL_ABILITIES:
      return 'specialAbilities';
    case IdPrefixes.SPELLS:
      return 'spells';
    case IdPrefixes.TALENTS:
      return 'skills';
    default:
      return;
  }
}

interface WikiKeyByCategory {
  [Categories.ADVANTAGES]: 'advantages';
  [Categories.ATTRIBUTES]: 'attributes';
  [Categories.BLESSINGS]: 'blessings';
  [Categories.CANTRIPS]: 'cantrips';
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques';
  [Categories.CULTURES]: 'cultures';
  [Categories.DISADVANTAGES]: 'disadvantages';
  [Categories.LITURGIES]: 'liturgicalChants';
  [Categories.PROFESSIONS]: 'professions';
  [Categories.PROFESSION_VARIANTS]: 'professionVariants';
  [Categories.RACES]: 'races';
  [Categories.RACE_VARIANTS]: 'raceVariants';
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities';
  [Categories.SPELLS]: 'spells';
  [Categories.TALENTS]: 'skills';
}

const wikiKeyByCategory: WikiKeyByCategory = {
  [Categories.ADVANTAGES]: 'advantages',
  [Categories.ATTRIBUTES]: 'attributes',
  [Categories.BLESSINGS]: 'blessings',
  [Categories.CANTRIPS]: 'cantrips',
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques',
  [Categories.CULTURES]: 'cultures',
  [Categories.DISADVANTAGES]: 'disadvantages',
  [Categories.LITURGIES]: 'liturgicalChants',
  [Categories.PROFESSIONS]: 'professions',
  [Categories.PROFESSION_VARIANTS]: 'professionVariants',
  [Categories.RACES]: 'races',
  [Categories.RACE_VARIANTS]: 'raceVariants',
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities',
  [Categories.SPELLS]: 'spells',
  [Categories.TALENTS]: 'skills',
}

export function getWikiStateKeyByCategory<T extends Categories>(category: T): WikiKeyByCategory[T] {
  return wikiKeyByCategory[category];
}

type ElementMixed = ActivatableInstance | Race | Culture | ProfessionView | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate;

export function isItemTemplateFromMixed(obj: ElementMixed): obj is ItemTemplate {
	return obj.hasOwnProperty('id') && obj.hasOwnProperty('name') && obj.hasOwnProperty('isTemplateLocked');
}

export function isItemTemplate(obj: Element): obj is ItemTemplate {
	return obj.hasOwnProperty('id') && obj.hasOwnProperty('name') && obj.hasOwnProperty('isTemplateLocked');
}

export function isProfession(obj: Element): obj is Profession {
	return !isItemTemplate(obj) && obj.category === Categories.PROFESSIONS;
}

export function isSpecialAbility(obj: Element): obj is SpecialAbility {
	return !isItemTemplate(obj) && obj.category === Categories.SPECIAL_ABILITIES;
}

export function isActivatableWikiObj(obj: Element): obj is SpecialAbility {
	return !isItemTemplate(obj) && (obj.category === Categories.SPECIAL_ABILITIES || obj.category === Categories.ADVANTAGES || obj.category === Categories.DISADVANTAGES);
}

export function isRemoveSpecializationSelection(obj: ProfessionVariantSelection): obj is RemoveSpecializationSelection {
	return obj.id === 'SPECIALISATION' && obj.hasOwnProperty('active');
}

export function isCombatTechniquesSelection(obj: ProfessionVariantSelection): obj is CombatTechniquesSelection {
	return obj.id === 'COMBAT_TECHNIQUES' && obj.hasOwnProperty('sid') && obj.hasOwnProperty('value') && obj.hasOwnProperty('amount');
}

export function isRemoveCombatTechniquesSelection(obj: ProfessionVariantSelection): obj is RemoveCombatTechniquesSelection {
	return obj.id === 'COMBAT_TECHNIQUES' && obj.hasOwnProperty('active');
}

export function isRemoveSecondCombatTechniquesSelection(obj: ProfessionVariantSelection): obj is RemoveCombatTechniquesSecondSelection {
	return obj.id === 'COMBAT_TECHNIQUES_SECOND' && obj.hasOwnProperty('active');
}
