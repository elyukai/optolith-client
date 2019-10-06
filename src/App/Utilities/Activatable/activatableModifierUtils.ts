import { fmap } from "../../../Data/Functor";
import { countWith, List } from "../../../Data/List";
import { bind, bindF, fromJust, isJust, listToMaybe, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { pipe } from "../pipe";
import { isMaybeActive } from "./isActive";

const { active } = ActivatableDependent.A
const { tier } = ActiveObject.A

const getFirstActive =
  pipe (
    fmap (active) as (m: Maybe<Record<ActivatableDependent>>) => Maybe<List<Record<ActiveObject>>>,
    bindF (listToMaybe)
  )

/**
 * `getModifierByActiveLevel mbase_mod mincrease mdecrease` adjusts the given
 * base `mbase_mod`. If the entry `mincrease`, that should increase the base, is
 * active, it adds the level to the base. If the entry `mdecrease`, that should
 * decrease the base, is active, it subtracts the level from the base. If the
 * passed base is `Nothing`, this function always returns `0`.
 */
export const getModifierByActiveLevel =
  (mbase_mod: Maybe<number>) =>
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>): number => {
    const increaseObject = getFirstActive (mincrease)
    const decreaseObject = getFirstActive (mdecrease)

    return maybe (0)
                 ((base_mod: number) => {
                   const increase_level = bind (increaseObject) (tier)

                   if (isJust (increase_level)) {
                     return base_mod + fromJust (increase_level)
                   }

                   const decrease_level = bind (decreaseObject) (tier)

                   if (isJust (decrease_level)) {
                     return base_mod - fromJust (decrease_level)
                   }

                   return base_mod
                 })
                 (mbase_mod)
  }

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
