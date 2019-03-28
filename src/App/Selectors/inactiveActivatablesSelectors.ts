import { fromArray, List } from "../../Data/List";
import { catMaybes, liftM2, mapMaybe, Maybe } from "../../Data/Maybe";
import { elems, lookup } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { uncurryN } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { ActivatableCategory, Categories } from "../Constants/Categories";
import { HeroModelRecord } from "../Models/Hero/HeroModel";
import { AdventurePointsCategories } from "../Models/View/AdventurePointsCategories";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { Advantage } from "../Models/Wiki/Advantage";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Activatable, WikiEntryByCategory, WikiEntryRecordByCategory } from "../Models/Wiki/wikiTypeHelpers";
import { getActivatableHeroSliceByCategory } from "../Utilities/Activatable/activatableActiveUtils";
import { getInactiveView } from "../Utilities/Activatable/activatableInactiveUtils";
import { getAllAvailableExtendedSpecialAbilities } from "../Utilities/Activatable/ExtendedStyleUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { pipe } from "../Utilities/pipe";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { getWikiSliceGetterByCategory } from "../Utilities/WikiUtils";
import { getAdventurePointsObject } from "./adventurePointsSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import * as stateSelectors from "./stateSelectors";

export const getExtendedSpecialAbilitiesToAdd = createMaybeSelector (
  stateSelectors.getBlessedStyleDependencies,
  stateSelectors.getCombatStyleDependencies,
  stateSelectors.getMagicalStyleDependencies,
  (...styleDependencles) =>
    getAllAvailableExtendedSpecialAbilities (catMaybes (fromArray (styleDependencles)))
)

const getId = Advantage.AL.id

type Inactive<T extends ActivatableCategory> = Record<InactiveActivatable<WikiEntryByCategory[T]>>

type Inactives<T extends ActivatableCategory> = Maybe<List<Inactive<T>>>

export const getInactiveForView =
  <T extends ActivatableCategory>
  (category: T) =>
  createMaybeSelector (
    stateSelectors.getCurrentHeroPresent,
    stateSelectors.getLocaleAsProp,
    getExtendedSpecialAbilitiesToAdd,
    getAdventurePointsObject,
    stateSelectors.getWiki,
    (mhero, l10n, validExtendedSpecialAbilities, madventure_points, wiki): Inactives<T> =>
      liftM2 ((hero: HeroModelRecord) => (adventure_points: Record<AdventurePointsCategories>) => {
               const wikiKey = getWikiSliceGetterByCategory (category)
               const wikiSlice = wikiKey (wiki)

               const stateSlice = getActivatableHeroSliceByCategory (category) (hero)

               return mapMaybe ((wiki_entry: WikiEntryRecordByCategory[T]) =>
                                 getInactiveView (l10n)
                                                 (wiki)
                                                 (hero)
                                                 (adventure_points)
                                                 (validExtendedSpecialAbilities)
                                                 (wiki_entry)
                                                 (lookup (getId (wiki_entry)) (stateSlice)))
                               (elems<Activatable> (wikiSlice))
             })
             (mhero)
             (madventure_points)
  )

type avai = true | OrderedSet<string>
type listAdv = List<Record<InactiveActivatable<Advantage>>>
type listDis = List<Record<InactiveActivatable<Disadvantage>>>
type listSA = List<Record<InactiveActivatable<SpecialAbility>>>

const getWikiEntry = InactiveActivatable.A.wikiEntry as
  <T extends ActivatableCategory> (x: Inactive<T>) => WikiEntryRecordByCategory[T]

const getSrc = Advantage.AL.src

export const getDeactiveAdvantages = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveForView (Categories.ADVANTAGES),
  uncurryN (liftM2<avai, listAdv, listAdv> (filterByAvailability (pipe (getWikiEntry, getSrc))))
)

export const getDeactiveDisadvantages = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveForView (Categories.DISADVANTAGES),
  uncurryN (liftM2<avai, listDis, listDis> (filterByAvailability (pipe (getWikiEntry, getSrc))))
)

export const getDeactiveSpecialAbilities = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveForView (Categories.SPECIAL_ABILITIES),
  uncurryN (liftM2<avai, listSA, listSA> (filterByAvailability (pipe (getWikiEntry, getSrc))))
)
