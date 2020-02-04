import { thrush } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { elem, elemF, filter, fromArray, List } from "../../Data/List"
import { bindF, Maybe } from "../../Data/Maybe"
import { elems, lookupF, OrderedMap, OrderedMapValueElement } from "../../Data/OrderedMap"
import { member, Record } from "../../Data/Record"
import { show } from "../../Data/Show"
import { ActivatableCategories, Category, SkillishCategories } from "../Constants/Categories"
import { ProfessionCombined } from "../Models/View/ProfessionCombined"
import { Advantage } from "../Models/Wiki/Advantage"
import { Blessing } from "../Models/Wiki/Blessing"
import { Cantrip } from "../Models/Wiki/Cantrip"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { Culture } from "../Models/Wiki/Culture"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { ItemTemplate } from "../Models/Wiki/ItemTemplate"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { Race } from "../Models/Wiki/Race"
import { Skill } from "../Models/Wiki/Skill"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { Spell } from "../Models/Wiki/Spell"
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel"
import { Activatable, Entry, EntryWithCategory, EntryWithGroup, SkillishEntry } from "../Models/Wiki/wikiTypeHelpers"
import { getCategoryById } from "./IDUtils"
import { pipe } from "./pipe"

interface WikiKeyByCategory {
  [Category.ADVANTAGES]: "advantages"
  [Category.ATTRIBUTES]: "attributes"
  [Category.BLESSINGS]: "blessings"
  [Category.CANTRIPS]: "cantrips"
  [Category.COMBAT_TECHNIQUES]: "combatTechniques"
  [Category.CULTURES]: "cultures"
  [Category.DISADVANTAGES]: "disadvantages"
  [Category.LITURGICAL_CHANTS]: "liturgicalChants"
  [Category.PROFESSIONS]: "professions"
  [Category.PROFESSION_VARIANTS]: "professionVariants"
  [Category.RACES]: "races"
  [Category.RACE_VARIANTS]: "raceVariants"
  [Category.SPECIAL_ABILITIES]: "specialAbilities"
  [Category.SPELLS]: "spells"
  [Category.SKILLS]: "skills"
}

type GetWikiSlice<C extends Category> = typeof WikiModel.A[WikiKeyByCategory[C]]

export const getWikiSliceGetterByCategory =
  <C extends Category> (x: C): GetWikiSlice<C> => {
    switch (x) {
      case Category.ADVANTAGES: return WikiModel.A.advantages as GetWikiSlice<C>
      case Category.ATTRIBUTES: return WikiModel.A.attributes as GetWikiSlice<C>
      case Category.BLESSINGS: return WikiModel.A.blessings as GetWikiSlice<C>
      case Category.CANTRIPS: return WikiModel.A.cantrips as GetWikiSlice<C>
      case Category.COMBAT_TECHNIQUES: return WikiModel.A.combatTechniques as GetWikiSlice<C>
      case Category.CULTURES: return WikiModel.A.cultures as GetWikiSlice<C>
      case Category.DISADVANTAGES: return WikiModel.A.disadvantages as GetWikiSlice<C>
      case Category.LITURGICAL_CHANTS: return WikiModel.A.liturgicalChants as GetWikiSlice<C>
      case Category.PROFESSIONS: return WikiModel.A.professions as GetWikiSlice<C>
      case Category.PROFESSION_VARIANTS: return WikiModel.A.professionVariants as GetWikiSlice<C>
      case Category.RACES: return WikiModel.A.races as GetWikiSlice<C>
      case Category.RACE_VARIANTS: return WikiModel.A.raceVariants as GetWikiSlice<C>
      case Category.SPECIAL_ABILITIES: return WikiModel.A.specialAbilities as GetWikiSlice<C>
      case Category.SPELLS: return WikiModel.A.spells as GetWikiSlice<C>
      case Category.SKILLS: return WikiModel.A.skills as GetWikiSlice<C>
      default: throw new TypeError (`${show (x)} is no valid wiki category!`)
    }
  }

export const getWikiEntryWithGetter =
  (wiki: WikiModelRecord) =>
  <G extends typeof WikiModel.AL[WikiKeyByCategory[Category]]> (getter: G) =>
    lookupF ((getter as (wiki: WikiModelRecord) => OrderedMap<string, Entry>) (wiki)) as
      (id: string) => Maybe<OrderedMapValueElement<ReturnType<G>>>

export const getWikiEntry =
  (wiki: WikiModelRecord) => (id: string): Maybe<EntryWithCategory> =>
    pipe (
           getCategoryById,
           fmap (getWikiSliceGetterByCategory as
                  (category: Category) => (wiki: WikiModelRecord) =>
                    OrderedMap<string, EntryWithCategory>),
           bindF (pipe (
                   getWikiEntryWithGetter (wiki) as
                     (g: (wiki: WikiModelRecord) => OrderedMap<string, EntryWithCategory>) =>
                       (id: string) => Maybe<EntryWithCategory>,
                   thrush (id)
                 ))
         )
         (id)

export const getAllWikiEntriesByGroup =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>) =>
  (groups: List<number>): List<T> =>
    filter<T> (pipe (Skill.AL.gr, elemF (groups)))
              (elems (wiki))

export const getAllWikiEntriesByVariadicGroups =
  <T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>, ...groups: number[]): List<T> =>
    filter<T> (pipe (Skill.AL.gr, elemF (fromArray (groups))))
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
    && elemF<Category> (ActivatableCategories)
                         (SpecialAbility.AL.category (obj as Record<SpecialAbility>))

const { category } = Skill.AL

export const isSkillishWikiEntry =
  (x: EntryWithCategory): x is SkillishEntry =>
    elem (category (x)) (SkillishCategories)

export const isActivatableWikiEntry =
  (x: EntryWithCategory): x is Activatable =>
    elem (category (x)) (ActivatableCategories)
