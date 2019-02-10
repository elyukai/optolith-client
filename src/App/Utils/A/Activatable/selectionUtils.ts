import { pipe } from "ramda";
import { alt } from "../../../../Control/Applicative";
import { bind, bindF, liftM2 } from "../../../../Control/Monad";
import { elemF, find, foldl } from "../../../../Data/Foldable";
import { fmap } from "../../../../Data/Functor";
import { consF, List } from "../../../../Data/List";
import { ensure, fromMaybe, Just, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { alter, OrderedMap } from "../../../../Data/OrderedMap";
import { isRecord, Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { DependencyObject } from "../../../Models/ActiveEntries/DependencyObject";
import { ActivatableDependency } from "../../../Models/Hero/heroTypeHelpers";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { Activatable } from "../../../Models/Wiki/wikiTypeHelpers";

const { select } = Advantage.A
const { id: getId, name, cost } = SelectOption.A
const { active, dependencies } = ActivatableDependent.A
const { sid, sid2 } = ActiveObject.A

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `Nothing` if not found.
 * @param obj The entry.
 */
export const findSelectOption =
  (obj: Activatable) =>
  (id: Maybe<string | number>): Maybe<Record<SelectOption>> =>
    bind<List<Record<SelectOption>>>
      (select (obj))
      (find<Record<SelectOption>> (pipe (getId, elemF (id))))

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `Nothing` if not found.
 * @param obj The entry.
 */
export const getSelectOptionName =
  (obj: Activatable) =>
  (id: Maybe<string | number>) =>
    fmap (name)
         (findSelectOption (obj) (id))

/**
 * Get a selection option's cost with the given id from given wiki entry.
 * Returns `Nothing` if not found.
 * @param obj The entry.
 */
export const getSelectOptionCost = (obj: Activatable) => pipe (findSelectOption (obj), bindF (cost))

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getActiveSelections = pipe (active, mapMaybe (sid))

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getActiveSelectionsMaybe:
  (x: Maybe<Record<ActivatableDependent>>) => Maybe<List<string | number>> =
    fmap (getActiveSelections)

type SecondarySelections = OrderedMap<number | string, List<string | number>>

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export const getActiveSecondarySelections =
  fmap (
    pipe (
      active as (r: Record<ActivatableDependent>) => ActivatableDependent["active"],
      foldl<Record<ActiveObject>, SecondarySelections>
        (map => selection =>
          fromMaybe
            (map)
            (liftM2<string | number, string | number, SecondarySelections>
              (id => id2 => alter<List<string | number>>
                (secondaries => alt (fmap (consF (id2))
                                          (secondaries))
                                    (Just (List (id2))))
                (id)
                (map))
              (sid (selection))
              (sid2 (selection)))
        )
        (OrderedMap.empty)
    )
  )

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections =
  fmap (
    pipe (
      dependencies,
      mapMaybe<ActivatableDependency, string | number | List<number>> (
        pipe (
          ensure<ActivatableDependency, Record<DependencyObject>> (isRecord),
          bindF (DependencyObject.A.sid)
        )
      )
    )
  )
