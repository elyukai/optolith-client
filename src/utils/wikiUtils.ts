import { ActivatableCategories, ActivatableCategory, Categories } from '../constants/Categories';
import { ProfessionCombined } from '../types/view';
import * as Wiki from '../types/wiki';
import { List, Maybe, OrderedMap, OrderedMapValueElement, Record } from './dataUtils';
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

export const getWikiStateKeyByCategory =
  <T extends Categories>(category: T): WikiKeyByCategory[T] =>
    wikiKeyByCategory[category];

export const getWikiStateKeyById = (id: string): Maybe<keyof Wiki.WikiAll> =>
  getCategoryById (id).fmap (getWikiStateKeyByCategory);

export const getWikiEntry =
  <T extends Wiki.Entry = Wiki.Entry>(state: Record<Wiki.WikiAll>) =>
    (id: string): Maybe<T> =>
      getWikiStateKeyById (id)
        .bind (key => Record.lookup<Wiki.WikiAll, keyof Wiki.WikiAll> (key) (state))
        .bind (slice => slice.lookup (id) as any);

export const getWikiEntryFromSlice = (wiki: Wiki.WikiRecord) =>
  <K extends keyof Wiki.WikiAll>(key: K) =>
    (id: string) =>
      wiki.get (key).lookup (id) as Maybe<OrderedMapValueElement<Wiki.WikiAll[K]>>;

export const getAllWikiEntriesByGroup =
  <T extends Wiki.EntryWithGroup = Wiki.EntryWithGroup>(
    wiki: OrderedMap<string, T>,
    ...groups: number[]
  ): List<T> =>
    wiki.elems ()
      .filter (e => groups.includes (e.get ('gr')));

type ElementMixed =
  // ActivatableInstance |
  Record<Wiki.Race> |
  Record<Wiki.Culture> |
  Record<ProfessionCombined> |
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
  return obj.toObject ().hasOwnProperty ('id') &&
    obj.toObject ().hasOwnProperty ('name') &&
    obj.toObject ().hasOwnProperty ('isTemplateLocked');
}

export const isItemTemplate = (obj: Wiki.Entry): obj is Record<Wiki.ItemTemplate> => {
  return obj.toObject ().hasOwnProperty ('id') &&
    obj.toObject ().hasOwnProperty ('name') &&
    obj.toObject ().hasOwnProperty ('isTemplateLocked');
}

export const isAttribute =
  (obj: Wiki.Entry): obj is Record<Wiki.Attribute> =>
    !isItemTemplate (obj)
      && obj.toObject ().category === Categories.ATTRIBUTES;

export const isProfession =
  (obj: Wiki.Entry): obj is Record<Wiki.Profession> =>
    !isItemTemplate (obj)
      && obj.toObject ().category === Categories.PROFESSIONS;

export const isSpecialAbility =
  (obj: Wiki.Entry): obj is Record<Wiki.SpecialAbility> =>
    !isItemTemplate (obj)
      && obj.toObject ().category === Categories.SPECIAL_ABILITIES;

export const isActivatableWikiObj =
  (obj: Wiki.Entry): obj is Wiki.Activatable =>
    !isItemTemplate (obj)
      && ActivatableCategories.elem (obj.toObject ().category as ActivatableCategory);

export const isRemoveSpecializationSelection = (
  obj: Wiki.ProfessionVariantSelection
): obj is Record<Wiki.RemoveSpecializationSelection> => {
  return obj.get ('id') === Wiki.ProfessionSelectionIds.SPECIALISATION
    && obj.member ('active');
};

export const isCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection
): obj is Record<Wiki.CombatTechniquesSelection> => {
  return (obj.get ('id') as Wiki.ProfessionSelectionIds)
    === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES
    && obj.member ('sid')
    && obj.member ('value')
    && obj.member ('amount');
};

export const isRemoveCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection
): obj is Record<Wiki.RemoveCombatTechniquesSelection> => {
  return (obj.get ('id') as Wiki.ProfessionSelectionIds)
    === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES
    && obj.member ('active');
};

export const isRemoveSecondCombatTechniquesSelection = (
  obj: Wiki.ProfessionVariantSelection
): obj is Record<Wiki.RemoveCombatTechniquesSecondSelection> => {
  return (obj.get ('id') as Wiki.ProfessionSelectionIds)
    === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
    && obj.member ('active');
};
