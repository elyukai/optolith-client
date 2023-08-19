import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import {
  BoundAdventurePoints,
  cachedAdventurePoints,
} from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { Rated, RatedDependency, RatedMap, RatedValue } from "../../shared/domain/ratedEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

export type RatedSlice<N extends string, E extends string> = {
  /**
   * Creates a new entry with an initial value if active. The initial adventure
   * points cache is calculated from the initial value.
   */
  create: (
    database: DatabaseState,
    id: number,
    value: RatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
    }>,
  ) => Rated

  /**
   * Creates a new entry with no initial value.
   */
  createInitial: (
    id: number,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
    }>,
  ) => Rated

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: Rated | undefined) => RatedValue

  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Increments the value of the entry with the given id.
     */
    incrementAction: ActionCreatorWithPayload<number, `${N}/increment${E}`>

    /**
     * Decrements the value of the entry with the given id.
     */
    decrementAction: ActionCreatorWithPayload<number, `${N}/decrement${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: Reducer<CharacterState, AnyAction, [database: DatabaseState]>
}

export const createRatedSlice = <N extends string, E extends string>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<RatedMap>
  minValue: number
  getImprovementCost: (id: number, database: DatabaseState) => ImprovementCost
}): RatedSlice<N, E> => {
  const updateCachedAdventurePoints = (entry: Draft<Rated>, database: DatabaseState) => {
    entry.cachedAdventurePoints = cachedAdventurePoints(
      entry.value,
      config.minValue,
      entry.boundAdventurePoints,
      config.getImprovementCost(entry.id, database),
    )
    return entry
  }

  const create: RatedSlice<N, E>["create"] = (
    database,
    id,
    value,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) =>
    updateCachedAdventurePoints(
      {
        id,
        value: Math.max(config.minValue, value),
        cachedAdventurePoints: {
          general: 0,
          bound: 0,
        },
        dependencies,
        boundAdventurePoints,
      },
      database,
    )

  const createInitial: RatedSlice<N, E>["createInitial"] = (
    id,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) => ({
    id,
    value: config.minValue,
    cachedAdventurePoints: {
      general: 0,
      bound: 0,
    },
    dependencies,
    boundAdventurePoints,
  })

  const getValue: RatedSlice<N, E>["getValue"] = entry => entry?.value ?? config.minValue

  const incrementAction = createAction<number, `${N}/increment${E}`>(
    `${config.namespace}/increment${config.entityName}`,
  )
  const decrementAction = createAction<number, `${N}/decrement${E}`>(
    `${config.namespace}/decrement${config.entityName}`,
  )

  const reducer = createImmerReducer(
    (state: Draft<CharacterState>, action, database: DatabaseState) => {
      if (incrementAction.match(action)) {
        const entry = (config.getState(state)[action.payload] ??= createInitial(action.payload))
        entry.value++
        updateCachedAdventurePoints(entry, database)
      } else if (decrementAction.match(action)) {
        const entry = config.getState(state)[action.payload]
        if (entry !== undefined && entry.value > config.minValue) {
          entry.value--
          updateCachedAdventurePoints(entry, database)
        }
      }
    },
  )

  return {
    create,
    createInitial,
    getValue,
    actions: {
      incrementAction,
      decrementAction,
    },
    reducer,
  }
}
