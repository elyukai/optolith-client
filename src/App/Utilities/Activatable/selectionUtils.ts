import { consF, foldl, List } from "../../../Data/List"
import { altF, bindF, ensure, fmap, fromMaybe, Just, liftM2, mapMaybe, Maybe } from "../../../Data/Maybe"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { ActivatableDependency } from "../../Models/Hero/heroTypeHelpers"
import { SelectOptions_getActiveSelections } from "../Activatable.gen"
import { pipe } from "../pipe"

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getActiveSelectionsMaybe = fmap (SelectOptions_getActiveSelections)

type SecondarySelections = OrderedMap<number | string, List<string | number>>

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export const getActiveSecondarySelections =
  fmap (pipe (
               ADA.active,
               foldl ((map: SecondarySelections) => (selection: Record<ActiveObject>) =>
                       fromMaybe (map)
                                 (liftM2<string | number, string | number, SecondarySelections>
                                   (id => id2 => alter<List<string | number>>
                                     (pipe (
                                       fmap (consF (id2)),
                                       altF (Just (List (id2)))
                                     ))
                                     (id)
                                     (map))
                                   (AOA.sid (selection))
                                   (AOA.sid2 (selection))))
                     (OrderedMap.empty)
             ))

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections:
  (m: Maybe<ActivatableDependent>) => Maybe<List<string | number | List<number>>> =
    fmap (pipe (
      x => x.dependencies,
      mapMaybe<ActivatableDependency, string | number | List<number>> (pipe (
        ensure (isRecord),
        bindF (DependencyObject.A.sid)
      ))
    ))
