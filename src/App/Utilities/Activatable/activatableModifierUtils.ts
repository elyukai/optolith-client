import { pipe } from "ramda";
import { fmap } from "../../../Data/Functor";
import { List } from "../../../Data/List";
import { bind, bindF, listToMaybe, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { isMaybeActive } from "./isActive";

const { active } = ActivatableDependent.A
const { tier } = ActiveObject.A

const getFirstActive =
  pipe (
    fmap (active) as (m: Maybe<Record<ActivatableDependent>>) => Maybe<List<Record<ActiveObject>>>,
    bindF (listToMaybe))

export const getModifierByActiveLevel =
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>) =>
  (mbase_mod: Maybe<number>) => {
    const increaseObject = getFirstActive (mincrease)
    const decreaseObject = getFirstActive (mdecrease)

    return maybe (0)
                 ((base_mod: number) => {
                   const increaseTier = bind (increaseObject) (tier)

                   if (Maybe.isJust (increaseTier)) {
                     return base_mod + Maybe.fromJust (increaseTier)
                   }

                   const decreaseTier = bind (decreaseObject) (tier)

                   if (Maybe.isJust (decreaseTier)) {
                     return base_mod - Maybe.fromJust (decreaseTier)
                   }

                   return base_mod
                 })
                 (mbase_mod)
  }

export const getModifierByIsActive =
  (mbase_mod: Maybe<number>) =>
  (mincrease: Maybe<Record<ActivatableDependent>>) =>
  (mdecrease: Maybe<Record<ActivatableDependent>>) =>{
    const hasIncrease = isMaybeActive (mincrease)
    const hasDecrease = isMaybeActive (mdecrease)

    return maybe (0)
                 ((baseMod: number) =>
                   hasIncrease ? baseMod + 1 : hasDecrease ? baseMod - 1 : baseMod)
                 (mbase_mod)
  }
