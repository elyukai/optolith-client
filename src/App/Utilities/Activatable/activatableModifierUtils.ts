import { countWith, List } from "../../../Data/List";
import { bindF, listToMaybe, Maybe, maybe, sum } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { pipe } from "../pipe";
import { isMaybeActive } from "./isActive";

const ADA = ActivatableDependent.A
const AOA = ActiveObject.A

const getLevel = pipe (bindF (pipe (ADA.active, listToMaybe)), bindF (AOA.tier), sum)

/**
 * ```haskell
 * modifyByLevel :: Int -> ActivatableDependent -> ActivatableDependent -> Int
 * ```
 *
 * `modifyByLevel value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value.
 */
export const modifyByLevel =
  (value: number) =>
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>): number =>
    value + getLevel (mincrease) - getLevel (mdecrease)

/**
 * ```haskell
 * modifyByLevelM :: Maybe Int -> ActivatableDependent -> ActivatableDependent -> Int
 * ```
 *
 * `modifyByLevel value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value. If `value` is `Nothing`, this
 * function always returns `0`.
 */
export const modifyByLevelM =
  (mvalue: Maybe<number>) =>
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>): number =>
    maybe (0)
          ((value: number) => modifyByLevel (value) (mincrease) (mdecrease))
          (mvalue)

/**
 * `getModifierByActiveLevel mbase_mod mincrease mdecrease` adjusts the given
 * base `mbase_mod`. If the entry `mincrease`, that should increase the base, is
 * active, it adds `1` to the base. If the entry `mdecrease`, that should
 * decrease the base, is active, it subtracts `1` from the base. If the
 * passed base is `Nothing`, this function always returns `0`.
 */
export const getModifierByIsActive =
  (mbase_mod: Maybe<number>) =>
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>): number => {
    const hasIncrease = isMaybeActive (mincrease)
    const hasDecrease = isMaybeActive (mdecrease)

    return maybe (0)
                 ((baseMod: number) =>
                   hasIncrease ? baseMod + 1 : hasDecrease ? baseMod - 1 : baseMod)
                 (mbase_mod)
  }

/**
 * `getModifierByActiveLevels mbase_mod mincreases mdecreases` adjusts the given
 * base `mbase_mod`.
 */
export const getModifierByIsActives =
  (mbase_mod: Maybe<number>) =>
  (mincreases: List<Maybe<Record<ActivatableDependent>>>) =>
  (mdecreases: List<Maybe<Record<ActivatableDependent>>>): number => {
    const incs = countWith (isMaybeActive) (mincreases)
    const decs = countWith (isMaybeActive) (mdecreases)

    return maybe (0)
                 ((baseMod: number) => baseMod + incs - decs)
                 (mbase_mod)
  }
