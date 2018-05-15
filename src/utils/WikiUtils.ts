import { ActivatableCategories, Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import { ActivatableInstance } from '../types/data.d';
import { Profession as ProfessionView } from '../types/view.d';
import * as Wiki from '../types/wiki.d';
import { getCategoryById } from './IDUtils';
import { convertMapToValues } from './collectionUtils';
import { Maybe, MaybeFunctor } from './maybe';
import { pipe } from './pipe';

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

export const getWikiStateKeyByCategory = <T extends Categories>(
  category: T,
): WikiKeyByCategory[T] => wikiKeyByCategory[category];

export const getWikiStateKeyById = (
  id: string,
): MaybeFunctor<keyof WikiState | undefined> => pipe(
  getCategoryById,
  category => Maybe(category).fmap(getWikiStateKeyByCategory),
)(id);

export const getWikiEntry = <T extends Wiki.Entry = Wiki.Entry>(
  state: WikiState,
  id: string,
): MaybeFunctor<T | undefined> => getWikiStateKeyById(id)
  .fmap(key => state[key])
  .fmap(slice => slice.get(id) as T | undefined);

export const getAllWikiEntriesByGroup =
  <T extends Wiki.EntryWithGroup = Wiki.EntryWithGroup>(
    wiki: Map<string, T>,
    ...groups: number[],
  ) => pipe<Map<string, T>, T[]>(
    convertMapToValues,
    list => list.filter(e => groups.includes(e.gr)),
  )(wiki);

type ElementMixed =
  ActivatableInstance |
  Wiki.Race |
  Wiki.Culture |
  ProfessionView |
  Wiki.Advantage |
  Wiki.Disadvantage |
  Wiki.Skill |
  Wiki.CombatTechnique |
  Wiki.SpecialAbility |
  Wiki.Spell |
  Wiki.Cantrip |
  Wiki.LiturgicalChant |
  Wiki.Blessing |
  Wiki.ItemTemplate;

export const isItemTemplateFromMixed = (obj: ElementMixed): obj is Wiki.ItemTemplate => {
  return obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('isTemplateLocked');
}

export const isItemTemplate = (obj: Wiki.Entry): obj is Wiki.ItemTemplate => {
  return obj.hasOwnProperty('id') &&
    obj.hasOwnProperty('name') &&
    obj.hasOwnProperty('isTemplateLocked');
}

export const isProfession = (obj: Wiki.Entry): obj is Wiki.Profession => {
	return !isItemTemplate(obj) && obj.category === Categories.PROFESSIONS;
}

export const isSpecialAbility = (obj: Wiki.Entry): obj is Wiki.SpecialAbility => {
	return !isItemTemplate(obj) && obj.category === Categories.SPECIAL_ABILITIES;
}

export const isActivatableWikiObj = (
  obj: Wiki.Entry,
): obj is Wiki.Activatable => {
	return !isItemTemplate(obj) && ActivatableCategories.includes(obj.category);
};

export const isRemoveSpecializationSelection = (
  obj: Wiki.ProfessionVariantSelection,
): obj is Wiki.RemoveSpecializationSelection => {
	return obj.id === 'SPECIALISATION' && obj.hasOwnProperty('active');
};

export const isCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection,
): obj is Wiki.CombatTechniquesSelection => {
  return obj.id === 'COMBAT_TECHNIQUES' &&
    obj.hasOwnProperty('sid') &&
    obj.hasOwnProperty('value') &&
    obj.hasOwnProperty('amount');
};

export const isRemoveCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection,
): obj is Wiki.RemoveCombatTechniquesSelection => {
	return obj.id === 'COMBAT_TECHNIQUES' && obj.hasOwnProperty('active');
};

export const isRemoveSecondCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection,
): obj is Wiki.RemoveCombatTechniquesSecondSelection => {
	return obj.id === 'COMBAT_TECHNIQUES_SECOND' && obj.hasOwnProperty('active');
};
