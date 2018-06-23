import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { Record } from './dataUtils';

export function reduce<T>(
	initial: T
): (...reducers: ((current: T) => T)[]) => T;
export function reduce<T, T2>(
	initial: T, options: T2
): (...reducers: ((current: T, options: T2) => T)[]) => T;
export function reduce<T, T2, T3>(
	initial: T, arg1: T2, arg2: T3
): (...reducers: ((current: T, arg1: T2, arg2: T3) => T)[]) => T;
export function reduce<T, T2, T3>(
	initial: T, arg1?: T2, arg2?: T3
): (...reducers: ((current: T, arg1?: T2, arg2?: T3) => T)[]) => T {
	return (...reducers) => {
		return reducers.reduce<T>((current, reducer) => {
			return reducer(current, arg1, arg2);
		}, initial);
	};
}

export type ActivatableReducer = (
  state: Record<Data.HeroDependent>,
  wikiEntry: Wiki.WikiActivatable,
  instance: Record<Data.ActivatableDependent>,
) => Record<Data.HeroDependent>;

export type OptionalActivatableReducer = (
  state: Record<Data.HeroDependent>,
  wikiEntry: Wiki.WikiActivatable,
  instance?: Record<Data.ActivatableDependent>,
) => Record<Data.HeroDependent>;
