import { OutputSelector, createSelector } from "@reduxjs/toolkit"

type Indexed = { [key: string | number]: any }

export const createPropertySelector = <S, O extends Indexed, K extends keyof O>(
  selector: (state: S) => O,
  property: K,
): OutputSelector<[typeof selector], O[K] | undefined, (obj: O) => O[K] | undefined> =>
  createSelector(selector, obj => obj[property])
