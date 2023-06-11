import { ActionReducerMapBuilder, Draft, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { cachedAdventurePoints } from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { CharacterState } from "./characterSlice.ts"

const minValue = 8
const getImprovementCost = (_id: number) => ImprovementCost.E

const updateCachedAdventurePoints = (entry: Draft<Rated>) => {
  entry.cachedAdventurePoints = cachedAdventurePoints(
    entry.value,
    minValue,
    entry.boundAdventurePoints,
    getImprovementCost(entry.id),
  )
}

/**
 * Creates a new entry with an initial value if active. The initial adventure
 * points cache is calculated from the initial value.
 */
export const createDynamicAttribute = (id: number, value: number = minValue): Rated => ({
  id,
  value: Math.max(minValue, value),
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Takes an entry that may not exist (because its instance has not been used
 * yet) and returns its value.
 */
export const attributeValue = (entry: Rated | undefined): number => entry?.value ?? minValue

export const incrementAttribute = createAction<number>("attributes/incrementAttribute")
export const decrementAttribute = createAction<number>("attributes/decrementAttribute")

export const attributesReducer = (builder: ActionReducerMapBuilder<CharacterState>) =>
  builder
    .addCase(incrementAttribute, (state, action) => {
      const entry = state.attributes[action.payload] ??= createDynamicAttribute(action.payload)
      entry.value++
      updateCachedAdventurePoints(entry)
    })
    .addCase(decrementAttribute, (state, action) => {
      const entry = state.attributes[action.payload]
      if (entry !== undefined && entry.value > minValue) {
        entry.value--
        updateCachedAdventurePoints(entry)
      }
    })
