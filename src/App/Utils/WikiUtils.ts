import { pipe } from "ramda";
import { ActivatableCategories, Categories, SkillishCategories } from "../../constants/Categories";
import { thrush } from "../../Data/Function";
import { elem, elemF, filter, fromArray, List } from "../../Data/List";
import { bindF, fmap, Maybe } from "../../Data/Maybe";
import { elems, lookupF, OrderedMap, OrderedMapValueElement } from "../../Data/OrderedMap";
import { member, Record } from "../../Data/Record";
import { show } from "../../Data/Show";
import { ProfessionCombined } from "../Models/View/ProfessionCombined";
import { Advantage } from "../Models/Wiki/Advantage";
import { Blessing } from "../Models/Wiki/Blessing";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Race } from "../Models/Wiki/Race";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { Activatable, Entry, EntryWithCategory, EntryWithGroup, SkillishEntry } from "../Models/Wiki/wikiTypeHelpers";
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
  <T extends Categories> (x: T): typeof WikiModel.A[WikiKeyByCategory[T]] => {
    switch (x) {
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

    throw new TypeError (`${show (x)} is no valid wiki category!`)
  }

export const getWikiEntryWithGetter =
  (wiki: WikiModelRecord) =>
  <G extends typeof WikiModel.A[WikiKeyByCategory[Categories]]> (getter: G) =>
    lookupF ((getter as (wiki: WikiModelRecord) => OrderedMap<string, Entry>) (wiki)) as
      (id: string) => Maybe<OrderedMapValueElement<ReturnType<G>>>

export const getWikiEntry =
  (wiki: WikiModelRecord) => (id: string): Maybe<EntryWithCategory> =>
    pipe (
           getCategoryById,
           fmap (getWikiSliceGetterByCategory as
                  (category: Categories) => (wiki: WikiModelRecord) =>
                    OrderedMap<string, EntryWithCategory>),
           bindF (pipe (
                   getWikiEntryWithGetter (wiki) as
                     (g: (wiki: WikiModelRecord) => OrderedMap<string, EntryWithCategory>) =>
                       (id: string) => Maybe<EntryWithCategory>,
                   thrush<string, Maybe<EntryWithCategory>> (id)
                 ))
         )
         (id)

export const getAllWikiEntriesByGroup =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>) =>
  (groups: List<number>): List<T> =>
    filter<T> (pipe (Skill.A.gr, elemF (groups)))
              (elems (wiki))

export const getAllWikiEntriesByVariadicGroups =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>, ...groups: number[]): List<T> =>
    filter<T> (pipe (Skill.A.gr, elemF (fromArray (groups))))
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

export const isActivatableWikiObj =
  (obj: Entry): obj is Activatable =>
    !isItemTemplate (obj)
    && elemF<Categories> (ActivatableCategories)
                         (SpecialAbility.A.category (obj as Record<SpecialAbility>))

const { category } = Skill.A

export const isSkillishWikiEntry =
  (x: EntryWithCategory): x is SkillishEntry =>
    elem (category (x)) (SkillishCategories)

export const isActivatableWikiEntry =
  (x: EntryWithCategory): x is Activatable =>
    elem (category (x)) (ActivatableCategories)
