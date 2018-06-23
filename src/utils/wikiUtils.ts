import { ActivatableCategories, Categories } from '../constants/Categories';
import { Profession as ProfessionView } from '../types/view.d';
import * as Wiki from '../types/wiki.d';
import { List, Maybe, OrderedMap, Record } from './dataUtils';
import { getCategoryById } from './IDUtils';

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
): WikiKeyByCategory[T] =>
  wikiKeyByCategory[category];

export const getWikiStateKeyById = (id: string): Maybe<keyof Wiki.WikiAll> =>
  getCategoryById(id).map(getWikiStateKeyByCategory);

export function getWikiEntry<T extends Wiki.Entry = Wiki.Entry>(
  state: Record<Wiki.WikiAll>,
): (id: string) => Maybe<T>;
export function getWikiEntry<T extends Wiki.Entry = Wiki.Entry>(
  state: Record<Wiki.WikiAll>,
  id: string,
): Maybe<T>;
export function getWikiEntry<T extends Wiki.Entry = Wiki.Entry>(
  state: Record<Wiki.WikiAll>,
  id?: string,
): Maybe<T> | ((id: string) => Maybe<T>) {
  if (id === undefined) {
    return xId =>
      getWikiStateKeyById(xId)
        .bind(state.lookup)
        .bind(slice => slice.lookup(xId) as any);
  }
  else {
    return getWikiStateKeyById(id)
      .bind(state.lookup)
      .bind(slice => slice.lookup(id) as any);
  }
};

export const getAllWikiEntriesByGroup =
  <T extends Wiki.EntryWithGroup = Wiki.EntryWithGroup>(
    wiki: OrderedMap<string, T>,
    ...groups: number[]
  ): List<T> =>
    wiki.elems()
      .filter(e => groups.includes(e.get('gr')));

type ElementMixed =
  // ActivatableInstance |
  Record<Wiki.Race> |
  Record<Wiki.Culture> |
  Record<ProfessionView> |
  Record<Wiki.Advantage> |
  Record<Wiki.Disadvantage> |
  Record<Wiki.Skill> |
  Record<Wiki.CombatTechnique> |
  Record<Wiki.SpecialAbility> |
  Record<Wiki.Spell> |
  Record<Wiki.Cantrip> |
  Record<Wiki.LiturgicalChant> |
  Record<Wiki.Blessing> |
  Record<Wiki.ItemTemplate>;

export const isItemTemplateFromMixed = (obj: ElementMixed): obj is Record<Wiki.ItemTemplate> => {
  return obj.toJS1().hasOwnProperty('id') &&
    obj.toJS1().hasOwnProperty('name') &&
    obj.toJS1().hasOwnProperty('isTemplateLocked');
}

export const isItemTemplate = (obj: Wiki.Entry): obj is Record<Wiki.ItemTemplate> => {
  return obj.toJS1().hasOwnProperty('id') &&
    obj.toJS1().hasOwnProperty('name') &&
    obj.toJS1().hasOwnProperty('isTemplateLocked');
}

export const isProfession =
  (obj: Wiki.Entry): obj is Record<Wiki.Profession> =>
    !isItemTemplate(obj)
      && obj.toJS1().category === Categories.PROFESSIONS;

export const isSpecialAbility =
  (obj: Wiki.Entry): obj is Record<Wiki.SpecialAbility> =>
    !isItemTemplate(obj)
      && obj.toJS1().category === Categories.SPECIAL_ABILITIES;

export const isActivatableWikiObj =
  (obj: Wiki.Entry): obj is Wiki.Activatable =>
    !isItemTemplate(obj)
      && ActivatableCategories.includes(obj.toJS1().category);

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
