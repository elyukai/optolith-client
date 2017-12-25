import { ADVANTAGES, DISADVANTAGES, PROFESSIONS, SPECIAL_ABILITIES } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import { ActivatableInstance } from '../types/data';
import { Profession as ProfessionView } from '../types/view';
import { Advantage, Blessing, Cantrip, CombatTechnique, CombatTechniquesSelection, Culture, Disadvantage, ItemTemplate, LiturgicalChant, Profession, ProfessionVariant, ProfessionVariantSelection, Race, RaceVariant, RemoveCombatTechniquesSecondSelection, RemoveCombatTechniquesSelection, RemoveSpecializationSelection, Skill, SpecialAbility, Spell } from '../types/wiki';
import { getWikiStateKeyById } from './IDUtils';

type Element = Race | RaceVariant | Culture | Profession | ProfessionVariant | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate;

export function getWikiEntry<T extends Element = Element>(state: WikiState, id: string): T | undefined {
	const key = getWikiStateKeyById(id);
	const slice = key && state[key];
	return slice && slice.get(id) as T | undefined;
}

type ElementMixed = ActivatableInstance | Race | Culture | ProfessionView | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate;

export function isItemTemplateFromMixed(obj: ElementMixed): obj is ItemTemplate {
	return obj.hasOwnProperty('id') && obj.hasOwnProperty('name') && obj.hasOwnProperty('isTemplateLocked');
}

export function isItemTemplate(obj: Element): obj is ItemTemplate {
	return obj.hasOwnProperty('id') && obj.hasOwnProperty('name') && obj.hasOwnProperty('isTemplateLocked');
}

export function isProfession(obj: Element): obj is Profession {
	return !isItemTemplate(obj) && obj.category === PROFESSIONS;
}

export function isSpecialAbility(obj: Element): obj is SpecialAbility {
	return !isItemTemplate(obj) && obj.category === SPECIAL_ABILITIES;
}

export function isActivatableWikiObj(obj: Element): obj is SpecialAbility {
	return !isItemTemplate(obj) && (obj.category === SPECIAL_ABILITIES || obj.category === ADVANTAGES || obj.category === DISADVANTAGES);
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
