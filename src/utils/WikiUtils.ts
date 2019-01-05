import { pipe } from "ramda";
import { ProfessionCombined } from "../App/Models/View/ProfessionCombined";
import { Advantage } from "../App/Models/Wiki/Advantage";
import { Attribute } from "../App/Models/Wiki/Attribute";
import { Blessing } from "../App/Models/Wiki/Blessing";
import { Cantrip } from "../App/Models/Wiki/Cantrip";
import { CombatTechnique } from "../App/Models/Wiki/CombatTechnique";
import { Culture } from "../App/Models/Wiki/Culture";
import { Disadvantage } from "../App/Models/Wiki/Disadvantage";
import { ItemTemplate } from "../App/Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../App/Models/Wiki/LiturgicalChant";
import { Profession } from "../App/Models/Wiki/Profession";
import { Race } from "../App/Models/Wiki/Race";
import { Skill } from "../App/Models/Wiki/Skill";
import { SpecialAbility } from "../App/Models/Wiki/SpecialAbility";
import { Spell } from "../App/Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../App/Models/Wiki/WikiModel";
import { Activatable, Entry, EntryWithGroup } from "../App/Models/Wiki/wikiTypeHelpers";
import { ActivatableCategories, Categories } from "../constants/Categories";
import { thrush } from "../Data/Function";
import { elem_, filter, fromArray, List } from "../Data/List";
import { bindF, fmap, Maybe } from "../Data/Maybe";
import { elems, lookup_, OrderedMap, OrderedMapValueElement } from "../Data/OrderedMap";
import { member, Record } from "../Data/Record";
import { show } from "../Data/Show";
import { getCategoryById } from "./IDUtils";

interface WikiKeyByCategory {
  [Categories.ADVANTAGES]: "advantages"
  [Categories.ATTRIBUTES]: "attributes"
  [Categories.BLESSINGS]: "blessings"
  [Categories.CANTRIPS]: "cantrips"
  [Categories.COMBAT_TECHNIQUES]: "combatTechniques"
  [Categories.CULTURES]: "cultures"
  [Categories.DISADVANTAGES]: "disadvantages"
  [Categories.LITURGIES]: "liturgicalChants"
  [Categories.PROFESSIONS]: "professions"
  [Categories.PROFESSION_VARIANTS]: "professionVariants"
  [Categories.RACES]: "races"
  [Categories.RACE_VARIANTS]: "raceVariants"
  [Categories.SPECIAL_ABILITIES]: "specialAbilities"
  [Categories.SPELLS]: "spells"
  [Categories.TALENTS]: "skills"
}

export const getWikiSliceGetterByCategory =
  <T extends Categories>(category: T): typeof WikiModel.A[WikiKeyByCategory[T]] => {
    switch (category) {
      case Categories.ADVANTAGES: return WikiModel.A.advantages
      case Categories.ATTRIBUTES: return WikiModel.A.attributes
      case Categories.BLESSINGS: return WikiModel.A.blessings
      case Categories.CANTRIPS: return WikiModel.A.cantrips
      case Categories.COMBAT_TECHNIQUES: return WikiModel.A.combatTechniques
      case Categories.CULTURES: return WikiModel.A.cultures
      case Categories.DISADVANTAGES: return WikiModel.A.disadvantages
      case Categories.LITURGIES: return WikiModel.A.liturgicalChants
      case Categories.PROFESSIONS: return WikiModel.A.professions
      case Categories.PROFESSION_VARIANTS: return WikiModel.A.professionVariants
      case Categories.RACES: return WikiModel.A.races
      case Categories.RACE_VARIANTS: return WikiModel.A.raceVariants
      case Categories.SPECIAL_ABILITIES: return WikiModel.A.specialAbilities
      case Categories.SPELLS: return WikiModel.A.spells
      case Categories.TALENTS: return WikiModel.A.skills
    }

    throw new TypeError (`${show (category)} is no valid wiki category!`)
  }

export const getWikiEntryWithGetter =
  (wiki: WikiModelRecord) =>
  <G extends typeof WikiModel.A[WikiKeyByCategory[Categories]]> (getter: G) =>
    lookup_ ((getter as (wiki: WikiModelRecord) => OrderedMap<string, Entry>) (wiki)) as
      (id: string) => Maybe<OrderedMapValueElement<ReturnType<G>>>

export const getWikiEntry =
  (wiki: WikiModelRecord) => (id: string): Maybe<Entry> =>
    pipe (
           getCategoryById,
           fmap<Categories, (wiki: WikiModelRecord) => OrderedMap<string, Entry>>
             (getWikiSliceGetterByCategory as
               (category: Categories) => (wiki: WikiModelRecord) =>
                 OrderedMap<string, Entry>),
           bindF<(wiki: WikiModelRecord) => OrderedMap<string, Entry>, Entry>
             (pipe (
               getWikiEntryWithGetter (wiki) as
                 (g: (wiki: WikiModelRecord) => OrderedMap<string, Entry>) =>
                   (id: string) => Maybe<Entry>,
               thrush (id)
             ))
         )
         (id)

export const getAllWikiEntriesByGroup =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>) =>
  (groups: List<number>): List<T> =>
    filter<T> (pipe (Skill.A.gr, elem_ (groups)))
              (elems (wiki))

export const getAllWikiEntriesByVariadicGroups =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>, ...groups: number[]): List<T> =>
    filter<T> (pipe (Skill.A.gr, elem_ (fromArray (groups))))
              (elems (wiki))

type ElementMixed =
  // ActivatableInstance |
  Record<Race> |
  Record<Culture> |
  Record<ProfessionCombined> |
  Record<Advantage> |
  Record<Disadvantage> |
  Record<Skill> |
  Record<CombatTechnique> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Cantrip> |
  Record<LiturgicalChant> |
  Record<Blessing> |
  Record<ItemTemplate>

export const isItemTemplateFromMixed =
  (obj: ElementMixed): obj is Record<ItemTemplate> =>
    member ("id") (obj)
    && member ("name") (obj)
    && member ("isTemplateLocked") (obj)

export const isItemTemplate =
  (obj: Entry): obj is Record<ItemTemplate> =>
    member ("id") (obj)
    && member ("name") (obj)
    && member ("isTemplateLocked") (obj)

export const isAttribute =
  (obj: Entry): obj is Record<Attribute> =>
    !isItemTemplate (obj)
    && Attribute.A.category (obj as Record<Attribute>) === Categories.ATTRIBUTES

export const isProfession =
  (obj: Entry): obj is Record<Profession> =>
    !isItemTemplate (obj)
    && Profession.A.category (obj as Record<Profession>) === Categories.PROFESSIONS

export const isSpecialAbility =
  (obj: Entry): obj is Record<SpecialAbility> =>
    !isItemTemplate (obj)
    && SpecialAbility.A.category (obj as Record<SpecialAbility>)
      === Categories.SPECIAL_ABILITIES

export const isActivatableWikiObj =
  (obj: Entry): obj is Activatable =>
    !isItemTemplate (obj)
    && elem_<Categories> (ActivatableCategories)
                         (SpecialAbility.A.category (obj as Record<SpecialAbility>))
