import { ActivatableDependent } from "../App/Models/ActiveEntries/ActivatableDependent";
import { HeroModelRecord } from "../App/Models/Hero/HeroModel";
import { Activatable } from "../App/Models/Wiki/wikiTypeHelpers";
import { Maybe } from "../Data/Maybe";
import { Record } from "../Data/Record";

export function reduce<T> (
  initial: T
): (...reducers: ((current: T) => T)[]) => T
export function reduce<T, T2> (
  initial: T, options: T2
): (...reducers: ((current: T, options: T2) => T)[]) => T
export function reduce<T, T2, T3> (
  initial: T, arg1: T2, arg2: T3
): (...reducers: ((current: T, arg1: T2, arg2: T3) => T)[]) => T
export function reduce<T, T2, T3> (
  initial: T, arg1?: T2, arg2?: T3
): (...reducers: ((current: T, arg1?: T2, arg2?: T3) => T)[]) => T {
  return (...reducers) => reducers.reduce<T> (
    (current, reducer) => reducer (current, arg1, arg2),
    initial
  )
}

export type ActivatableReducer = (
  state: HeroModelRecord,
  wikiEntry: Activatable,
  instance: Record<ActivatableDependent>
) => HeroModelRecord

export type OptionalActivatableReducer = (
  state: HeroModelRecord,
  wikiEntry: Activatable,
  instance: Maybe<Record<ActivatableDependent>>
) => HeroModelRecord
