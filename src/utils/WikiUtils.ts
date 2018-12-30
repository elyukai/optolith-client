import { pipe } from 'ramda';
import { ActivatableCategories, Categories } from '../constants/Categories';
import { getCategoryById } from './IDUtils';
import { thrush } from './structures/Function';
import { elem_, filter, fromArray, List } from './structures/List';
import { bind_, fmap, Maybe } from './structures/Maybe';
import { elems, lookup_, OrderedMap, OrderedMapValueElement } from './structures/OrderedMap';
import { member, Record } from './structures/Record';
import { show } from './structures/Show';
import { ProfessionCombined } from './viewData/viewTypeHelpers';
import { AttributeG } from './wikiData/Attribute';
import { ProfessionG } from './wikiData/Profession';
import { SkillG } from './wikiData/Skill';
import { SpecialAbilityG } from './wikiData/SpecialAbilityCreator';
import { WikiModelG } from './wikiData/WikiModel';
import * as Wiki from './wikiData/wikiTypeHelpers';

interface WikiKeyByCategory {
  [Categories.ADVANTAGES]: 'advantages'
  [Categories.ATTRIBUTES]: 'attributes'
  [Categories.BLESSINGS]: 'blessings'
  [Categories.CANTRIPS]: 'cantrips'
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques'
  [Categories.CULTURES]: 'cultures'
  [Categories.DISADVANTAGES]: 'disadvantages'
  [Categories.LITURGIES]: 'liturgicalChants'
  [Categories.PROFESSIONS]: 'professions'
  [Categories.PROFESSION_VARIANTS]: 'professionVariants'
  [Categories.RACES]: 'races'
  [Categories.RACE_VARIANTS]: 'raceVariants'
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities'
  [Categories.SPELLS]: 'spells'
  [Categories.TALENTS]: 'skills'
}

export const getWikiSliceGetterByCategory =
  <T extends Categories>(category: T): typeof WikiModelG[WikiKeyByCategory[T]] => {
    switch (category) {
      case Categories.ADVANTAGES: return WikiModelG.advantages
      case Categories.ATTRIBUTES: return WikiModelG.attributes
      case Categories.BLESSINGS: return WikiModelG.blessings
      case Categories.CANTRIPS: return WikiModelG.cantrips
      case Categories.COMBAT_TECHNIQUES: return WikiModelG.combatTechniques
      case Categories.CULTURES: return WikiModelG.cultures
      case Categories.DISADVANTAGES: return WikiModelG.disadvantages
      case Categories.LITURGIES: return WikiModelG.liturgicalChants
      case Categories.PROFESSIONS: return WikiModelG.professions
      case Categories.PROFESSION_VARIANTS: return WikiModelG.professionVariants
      case Categories.RACES: return WikiModelG.races
      case Categories.RACE_VARIANTS: return WikiModelG.raceVariants
      case Categories.SPECIAL_ABILITIES: return WikiModelG.specialAbilities
      case Categories.SPELLS: return WikiModelG.spells
      case Categories.TALENTS: return WikiModelG.skills
    }

    throw new TypeError (`${show (category)} is no valid wiki category!`)
  }

export const getWikiEntryWithGetter =
  (wiki: Wiki.WikiRecord) =>
  <G extends typeof WikiModelG[WikiKeyByCategory[Categories]]> (getter: G) =>
    lookup_ ((getter as (wiki: Wiki.WikiRecord) => OrderedMap<string, Wiki.Entry>) (wiki)) as
      (id: string) => Maybe<OrderedMapValueElement<ReturnType<G>>>

export const getWikiEntry =
  (wiki: Wiki.WikiRecord) => (id: string): Maybe<Wiki.Entry> =>
    pipe (
           getCategoryById,
           fmap<Categories, (wiki: Wiki.WikiRecord) => OrderedMap<string, Wiki.Entry>>
             (getWikiSliceGetterByCategory as
               (category: Categories) => (wiki: Wiki.WikiRecord) =>
                 OrderedMap<string, Wiki.Entry>),
           bind_<(wiki: Wiki.WikiRecord) => OrderedMap<string, Wiki.Entry>, Wiki.Entry>
             (pipe (
               getWikiEntryWithGetter (wiki) as
                 (g: (wiki: Wiki.WikiRecord) => OrderedMap<string, Wiki.Entry>) =>
                   (id: string) => Maybe<Wiki.Entry>,
               thrush (id)
             ))
         )
         (id)

export const getAllWikiEntriesByGroup =
  <T extends Wiki.EntryWithGroup = Wiki.EntryWithGroup>
  (wiki: OrderedMap<string, T>) =>
  (groups: List<number>): List<T> =>
    filter<T> (pipe (SkillG.gr, elem_ (groups)))
              (elems (wiki))

export const getAllWikiEntriesByVariadicGroups =
  <T extends Wiki.EntryWithGroup = Wiki.EntryWithGroup>
  (wiki: OrderedMap<string, T>, ...groups: number[]): List<T> =>
    filter<T> (pipe (SkillG.gr, elem_ (fromArray (groups))))
              (elems (wiki))

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
  Record<Wiki.ItemTemplate>

export const isItemTemplateFromMixed =
  (obj: ElementMixed): obj is Record<Wiki.ItemTemplate> =>
    member ('id') (obj)
    && member ('name') (obj)
    && member ('isTemplateLocked') (obj)

export const isItemTemplate =
  (obj: Wiki.Entry): obj is Record<Wiki.ItemTemplate> =>
    member ('id') (obj)
    && member ('name') (obj)
    && member ('isTemplateLocked') (obj)

export const isAttribute =
  (obj: Wiki.Entry): obj is Record<Wiki.Attribute> =>
    !isItemTemplate (obj)
    && AttributeG.category (obj as Record<Wiki.Attribute>) === Categories.ATTRIBUTES

export const isProfession =
  (obj: Wiki.Entry): obj is Record<Wiki.Profession> =>
    !isItemTemplate (obj)
    && ProfessionG.category (obj as Record<Wiki.Profession>) === Categories.PROFESSIONS

export const isSpecialAbility =
  (obj: Wiki.Entry): obj is Record<Wiki.SpecialAbility> =>
    !isItemTemplate (obj)
    && SpecialAbilityG.category (obj as Record<Wiki.SpecialAbility>)
      === Categories.SPECIAL_ABILITIES

export const isActivatableWikiObj =
  (obj: Wiki.Entry): obj is Wiki.Activatable =>
    !isItemTemplate (obj)
    && elem_ (ActivatableCategories) (SpecialAbilityG.category (obj as Record<Wiki.SpecialAbility>))
