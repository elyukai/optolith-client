import { fmapF } from "../../Data/Functor";
import { append, List } from "../../Data/List";
import { fromMaybe, Maybe } from "../../Data/Maybe";
import { Accessor, Record, RecordI } from "../../Data/Record";
import { ActiveActivatable } from "../Models/View/ActiveActivatable";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { Advantage } from "../Models/Wiki/Advantage";
import { L10nRecord } from "../Models/Wiki/L10n";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Activatable } from "../Models/Wiki/wikiTypeHelpers";
import { createMapMaybeSelector } from "../Utilities/createMapMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { FilterAccessor } from "../Utilities/filterBy";
import { compareLocale } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { comparingR, SortOptions } from "../Utilities/sortBy";
import { getAdvantagesForEditMap, getDisadvantagesForEditMap, getSpecialAbilitiesForEditMap } from "./activatableSelectors";
import { getDeactiveAdvantages, getDeactiveDisadvantages, getDeactiveSpecialAbilities } from "./inactiveActivatablesSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
import { getHeroes, getInactiveAdvantagesFilterText, getInactiveDisadvantagesFilterText, getInactiveSpecialAbilitiesFilterText, getLocaleAsProp } from "./stateSelectors";
import { getEnableActiveItemHints } from "./uisettingsSelectors";

const getName = pipe (InactiveActivatable.AL.wikiEntry, Advantage.AL.name)
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
  (filterAccessors: FilterAccessor<RecordI<InactiveOrActive<A>>>[]) =>
  (sortOptions: SortOptions<RecordI<InactiveOrActive<A>>>) =>
  (filterText: string) =>
  (areHintsEnabled: boolean): Maybe<List<InactiveOrActive<A>>> =>
    fmapF (minactive)
          (inactive => areHintsEnabled
            ? filterAndSortRecordsBy (0)
                                     <RecordI<InactiveOrActive<A>>>
                                     (filterAccessors)
                                     (sortOptions)
                                     (filterText)
                                     (append<InactiveOrActive<A>> (active) (inactive)) as
                                       List<InactiveOrActive<A>>
            : filterAndSortRecordsBy (0)
                                     <InactiveActivatable<A>>
                                     ([getName])
                                     (sortOptions)
                                     (filterText)
                                     (inactive))

const sortByName = (l10n: L10nRecord) => [comparingR (getName)
                                                     (compareLocale (l10n))]

export const getFilteredInactiveAdvantages =
  createMapMaybeSelector (getHeroes)
                         (getDeactiveAdvantages, getAdvantagesForEditMap)
                         (
                           getInactiveAdvantagesFilterText,
                           getLocaleAsProp,
                           getEnableActiveItemHints
                         )
                         ()
                         ((minactive, mactive) => (filterText, l10n, areHintsEnabled) => () =>
                           getFilteredInactives (minactive)
                                                (mactive)
                                                ([getName])
                                                (sortByName (l10n))
                                                (filterText)
                                                (areHintsEnabled))

export const getFilteredInactiveDisadvantages =
  createMapMaybeSelector (getHeroes)
                         (getDeactiveDisadvantages, getDisadvantagesForEditMap)
                         (
                           getInactiveDisadvantagesFilterText,
                           getLocaleAsProp,
                           getEnableActiveItemHints
                         )
                         ()
                         ((minactive, mactive) => (filterText, l10n, areHintsEnabled) => () =>
                           getFilteredInactives (minactive)
                                                (mactive)
                                                ([getName])
                                                (sortByName (l10n))
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
                                                 ([getName, getNameInWiki])
                                                 (sort_options)
                                                 (filterText)
                                                 (areHintsEnabled))
