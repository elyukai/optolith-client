import { flip } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { fromArray, List } from "../../Data/List";
import { catMaybes, join, liftM2, mapMaybe, Maybe } from "../../Data/Maybe";
import { elems, lookup } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { ActivatableCategory, Categories } from "../Constants/Categories";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { Advantage } from "../Models/Wiki/Advantage";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { Activatable, WikiEntryByCategory, WikiEntryRecordByCategory } from "../Models/Wiki/wikiTypeHelpers";
import { heroReducer } from "../Reducers/heroReducer";
import { getActivatableHeroSliceByCategory } from "../Utilities/Activatable/activatableActiveUtils";
import { getInactiveView } from "../Utilities/Activatable/activatableInactiveUtils";
import { getAllAvailableExtendedSpecialAbilities } from "../Utilities/Activatable/ExtendedStyleUtils";
import { createMapMaybeSelector } from "../Utilities/createMapMaybeSelector";
import { createMapSelector, ignore3rd } from "../Utilities/createMapSelector";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { pipe } from "../Utilities/pipe";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { sortRecordsBy } from "../Utilities/sortBy";
import { getWikiSliceGetterByCategory } from "../Utilities/WikiUtils";
import { getAPObjectMap } from "./adventurePointsSelectors";
import { EnabledSourceBooks, getRuleBooksEnabled } from "./rulesSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
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
    createMapSelector (stateSelectors.getHeroes)
                      (getAPObjectMap)
                      (
                        stateSelectors.getLocaleAsProp,
                        getExtendedSpecialAbilitiesToAdd,
                        stateSelectors.getWiki
                      )
                      (heroReducer.A.present)
                      (madventure_points =>
                       (l10n, validExtendedSpecialAbilities, wiki) =>
                       (hero): Inactives<T> =>
                         fmapF (join (madventure_points))
                               (adventure_points => {
                                 const wikiKey = getWikiSliceGetterByCategory (category)
                                 const wikiSlice = wikiKey (wiki)

                                 const stateSlice = getActivatableHeroSliceByCategory (category)
                                                                                      (hero)

                                 return mapMaybe ((wiki_entry: WikiEntryRecordByCategory[T]) =>
                                                   getInactiveView (l10n)
                                                                   (wiki)
                                                                   (hero)
                                                                   (adventure_points)
                                                                   (validExtendedSpecialAbilities)
                                                                   (wiki_entry)
                                                                   (lookup (getId (wiki_entry))
                                                                           (stateSlice)))
                                                 (elems<Activatable> (wikiSlice))
                               })
                    )

const getInactiveAdvantagesForView = getInactiveForView (Categories.ADVANTAGES)
const getInactiveDisadvantagesForView = getInactiveForView (Categories.DISADVANTAGES)
const getInactiveSpecialAbilitiesForView = getInactiveForView (Categories.SPECIAL_ABILITIES)

type Av = EnabledSourceBooks
type listAdv = List<Record<InactiveActivatable<Advantage>>>
type listDis = List<Record<InactiveActivatable<Disadvantage>>>
type listSA = List<Record<InactiveActivatable<SpecialAbility>>>

const IAA = InactiveActivatable.A

const getWikiEntry = IAA.wikiEntry as
  <T extends ActivatableCategory> (x: Inactive<T>) => WikiEntryRecordByCategory[T]

const getSrc = pipe (getWikiEntry, Advantage.AL.src) as
  <T extends ActivatableCategory> (x: Inactive<T>) => List<Record<SourceLink>>

const filterDeactiveAdv =
  ignore3rd (flip (liftM2<Av, listAdv, listAdv> (filterByAvailability (getSrc))))

const filterDeactiveDis =
  filterDeactiveAdv as (a: Maybe<listDis>) => (b: Maybe<Av>) => () => Maybe<listDis>

export const getDeactiveAdvantages =
  createMapMaybeSelector (stateSelectors.getHeroes)
                         (getInactiveAdvantagesForView)
                         (getRuleBooksEnabled)
                         ()
                         (filterDeactiveAdv)

export const getDeactiveDisadvantages =
  createMapMaybeSelector (stateSelectors.getHeroes)
                         (getInactiveDisadvantagesForView)
                         (getRuleBooksEnabled)
                         ()
                         (filterDeactiveDis)

type CatSA = Categories.SPECIAL_ABILITIES
type InAcSA = InactiveActivatable<SpecialAbility>

export const getDeactiveSpecialAbilities =
  createMapMaybeSelector (stateSelectors.getHeroes)
                         (getInactiveSpecialAbilitiesForView)
                         (getSpecialAbilitiesSortOptions, getRuleBooksEnabled)
                         ()
                         (mxs => (sort_options, mrules) => () =>
                           liftM2<Av, listSA, listSA> (availability => pipe (
                                                        filterByAvailability (getSrc)
                                                                             <CatSA> (availability),
                                                        sortRecordsBy<InAcSA> (sort_options)
                                                      ))
                                                      (mrules)
                                                      (mxs))
