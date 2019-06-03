import { fmapF } from "../../Data/Functor";
import { append, List } from "../../Data/List";
import { Maybe, maybe } from "../../Data/Maybe";
import { Record, RecordI } from "../../Data/Record";
import { uncurryN5 } from "../../Data/Tuple/Curry";
import { ActiveActivatable } from "../Models/View/ActiveActivatable";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { Advantage } from "../Models/Wiki/Advantage";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { Activatable } from "../Models/Wiki/wikiTypeHelpers";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { compareLocale } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { comparingR, SortOptions } from "../Utilities/sortBy";
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from "./activatableSelectors";
import { getDeactiveAdvantages, getDeactiveDisadvantages, getDeactiveSpecialAbilities } from "./inactiveActivatablesSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
import { getInactiveAdvantagesFilterText, getInactiveDisadvantagesFilterText, getInactiveSpecialAbilitiesFilterText, getLocaleAsProp } from "./stateSelectors";
import { getEnableActiveItemHints } from "./uisettingsSelectors";

const getName = pipe (InactiveActivatable.AL.wikiEntry, Advantage.AL.name)

type InactiveOrActive<A extends RecordI<Activatable>> =
  Record<ActiveActivatable<A>>
  | Record<InactiveActivatable<A>>

const getFilteredInactives =
  <A extends RecordI<Activatable>>
  (minactive: Maybe<List<Record<InactiveActivatable<A>>>>) =>
  (mactive: Maybe<List<Record<ActiveActivatable<A>>>>) =>
  (sortOptions: SortOptions<RecordI<InactiveOrActive<A>>>) =>
  (filterText: string) =>
  (areHintsEnabled: boolean): Maybe<List<InactiveOrActive<A>>> =>
    fmapF (minactive)
          (inactive => areHintsEnabled
            ? filterAndSortRecordsBy (0)
                                     <RecordI<InactiveOrActive<A>>>
                                     ([getName])
                                     (sortOptions)
                                     (filterText)
                                     (maybe (inactive as List<InactiveOrActive<A>>)
                                            ((active: List<InactiveOrActive<A>>) =>
                                              append (active) (inactive))
                                            (mactive)) as List<InactiveOrActive<A>>
            : filterAndSortRecordsBy (0)
                                     <InactiveActivatable<A>>
                                     ([getName])
                                     (sortOptions)
                                     (filterText)
                                     (inactive))

const sortByName = (l10n: L10nRecord) => [comparingR (getName)
                                                     (compareLocale (L10n.A.id (l10n)))]

export const getFilteredInactiveAdvantages =
  (hero_id: string) =>
    createMaybeSelector (
      getDeactiveAdvantages (hero_id),
      getAdvantagesForEdit,
      getInactiveAdvantagesFilterText,
      getLocaleAsProp,
      getEnableActiveItemHints,
      (minactive, mactive, filterText, l10n, areHintsEnabled) =>
        getFilteredInactives (minactive)
                             (mactive)
                             (sortByName (l10n))
                             (filterText)
                             (areHintsEnabled)
    )

export const getFilteredInactiveDisadvantages =
  (hero_id: string) =>
    createMaybeSelector (
      getDeactiveDisadvantages (hero_id),
      getDisadvantagesForEdit,
      getInactiveDisadvantagesFilterText,
      getLocaleAsProp,
      getEnableActiveItemHints,
      (minactive, mactive, filterText, l10n, areHintsEnabled) =>
        getFilteredInactives (minactive)
                             (mactive)
                             (sortByName (l10n))
                             (filterText)
                             (areHintsEnabled)
    )

export const getFilteredInactiveSpecialAbilities =
  (hero_id: string) =>
    createMaybeSelector (
      getDeactiveSpecialAbilities (hero_id),
      getSpecialAbilitiesForEdit,
      getSpecialAbilitiesSortOptions,
      getInactiveSpecialAbilitiesFilterText,
      getEnableActiveItemHints,
      uncurryN5 (getFilteredInactives)
    )
