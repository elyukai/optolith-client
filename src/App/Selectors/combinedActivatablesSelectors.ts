import { fmapF } from "../../Data/Functor"
import { append, List } from "../../Data/List"
import { fromMaybe, Maybe } from "../../Data/Maybe"
import { Accessor, Record, RecordI } from "../../Data/Record"
import { ActiveActivatable } from "../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../Models/View/InactiveActivatable"
import { Advantage } from "../Models/Wiki/Advantage"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { Activatable } from "../Models/Wiki/wikiTypeHelpers"
import { createMapMaybeSelector } from "../Utilities/createMapMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { FilterAccessor } from "../Utilities/filterBy"
import { compareLocale } from "../Utilities/I18n"
import { pipe } from "../Utilities/pipe"
import { comparingR, SortOptions } from "../Utilities/sortBy"
import { getAdvantagesForEditMap, getDisadvantagesForEditMap, getSpecialAbilitiesForEditMap } from "./activatableSelectors"
import { getDeactiveAdvantages, getDeactiveDisadvantages, getDeactiveSpecialAbilities } from "./inactiveActivatablesSelectors"
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors"
import { getHeroes, getInactiveAdvantagesFilterText, getInactiveDisadvantagesFilterText, getInactiveSpecialAbilitiesFilterText, getWiki } from "./stateSelectors"
import { getEnableActiveItemHints } from "./uisettingsSelectors"

type getName = <A extends Advantage | Disadvantage | SpecialAbility>
               (r: Record<{ "wikiEntry": Record<A>; "@@name": string }>) => string
// eslint-disable-next-line @typescript-eslint/no-redeclare
const getName: getName = pipe (InactiveActivatable.AL.wikiEntry, Advantage.AL.name) as getName

const getNameInWiki =
  pipe (
    InactiveActivatable.AL.wikiEntry as Accessor<InactiveActivatable<SpecialAbility>, "wikiEntry">,
    SpecialAbility.A.nameInWiki,
    fromMaybe ("")
  )

type InactiveOrActive<A extends RecordI<Activatable>> =
  Record<ActiveActivatable<A>>
  | Record<InactiveActivatable<A>>

const getFilteredInactives =
  <A extends RecordI<Activatable>>
  (minactive: Maybe<List<Record<InactiveActivatable<A>>>>) =>
  (active: List<Record<ActiveActivatable<A>>>) =>
  (filterAccessors: FilterAccessor<InactiveOrActive<A>>[]) =>
  (sortOptions: SortOptions<InactiveOrActive<A>>) =>
  (filterText: string) =>
  (areHintsEnabled: boolean): Maybe<List<InactiveOrActive<A>>> =>
    fmapF (minactive)
          (inactive => areHintsEnabled
            ? filterAndSortRecordsBy (0)
                                     (filterAccessors)
                                     (sortOptions)
                                     (filterText)
                                     (append<InactiveOrActive<A>> (active) (inactive))
            : filterAndSortRecordsBy (0)
                                     <Record<InactiveActivatable<A>>>
                                     ([ getName ])
                                     (sortOptions)
                                     (filterText)
                                     (inactive))

const sortByName = (staticData: StaticDataRecord) => [ comparingR (getName)
                                                                  (compareLocale (staticData)) ]

export const getFilteredInactiveAdvantages =
  createMapMaybeSelector (getHeroes)
                         (getDeactiveAdvantages, getAdvantagesForEditMap)
                         (
                           getInactiveAdvantagesFilterText,
                           getWiki,
                           getEnableActiveItemHints
                         )
                         ()
                         ((minactive, mactive) => (filterText, staticData, areHintsEnabled) => () =>
                           getFilteredInactives (minactive)
                                                (mactive)
                                                ([ getName ])
                                                (sortByName (staticData))
                                                (filterText)
                                                (areHintsEnabled))

export const getFilteredInactiveDisadvantages =
  createMapMaybeSelector (getHeroes)
                         (getDeactiveDisadvantages, getDisadvantagesForEditMap)
                         (
                           getInactiveDisadvantagesFilterText,
                           getWiki,
                           getEnableActiveItemHints
                         )
                         ()
                         ((minactive, mactive) => (filterText, staticData, areHintsEnabled) => () =>
                           getFilteredInactives (minactive)
                                                (mactive)
                                                ([ getName ])
                                                (sortByName (staticData))
                                                (filterText)
                                                (areHintsEnabled))

export const getFilteredInactiveSpecialAbilities =
  createMapMaybeSelector (getHeroes)
                         (getDeactiveSpecialAbilities, getSpecialAbilitiesForEditMap)
                         (
                           getSpecialAbilitiesSortOptions,
                           getInactiveSpecialAbilitiesFilterText,
                           getEnableActiveItemHints
                         )
                         ()
                         ((minactive, mactive) =>
                          (sort_options, filterText, areHintsEnabled) =>
                          () =>
                            getFilteredInactives (minactive)
                                                 (mactive)
                                                 ([ getName, getNameInWiki ])
                                                 (sort_options)
                                                 (filterText)
                                                 (areHintsEnabled))
