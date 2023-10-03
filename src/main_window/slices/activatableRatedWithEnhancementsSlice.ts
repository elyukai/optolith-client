import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import {
  BoundAdventurePoints,
  cachedAdventurePointsForActivatableWithEnhancements,
} from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { Enhancement } from "../../shared/domain/enhancement.ts"
import { RatedDependency } from "../../shared/domain/rated/ratedDependency.ts"
import {
  ActivatableRatedValue,
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
} from "../../shared/domain/ratedEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

/**
 * Functions for working with rated entries that can be activated and have
 * enhancements.
 */
export type ActivatableRatedWithEnhancementsSlice<N extends string, E extends string> = {
  /**
   * Creates a new entry with an initial value if active. The initial adventure
   * points cache is calculated from the initial value.
   */
  create: (
    database: DatabaseState,
    id: number,
    value: ActivatableRatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
      enhancements: {
        [id: number]: Enhancement
      }
    }>,
  ) => ActivatableRatedWithEnhancements

  /**
   * Creates a new entry with no initial value.
   */
  createInitial: (
    id: number,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
    }>,
  ) => ActivatableRatedWithEnhancements

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: ActivatableRatedWithEnhancements | undefined) => ActivatableRatedValue

  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Add the entry with the given id.
     */
    addAction: ActionCreatorWithPayload<number, `${N}/add${E}`>

    /**
     * Remove the entry with the given id.
     */
    removeAction: ActionCreatorWithPayload<number, `${N}/remove${E}`>

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

/**
 * Creates a slice for a map of rated entries.
 */
export const createActivatableRatedWithEnhancementsSlice = <
  N extends string,
  E extends string,
>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<ActivatableRatedWithEnhancementsMap>
  getImprovementCost: (id: number, database: DatabaseState) => ImprovementCost
  getEnhancementAdventurePointsModifier: (
    id: number,
    enhancementId: number,
    database: DatabaseState,
  ) => number
}): ActivatableRatedWithEnhancementsSlice<N, E> => {
  const updateCachedAdventurePoints = (
    entry: Draft<ActivatableRatedWithEnhancements>,
    database: DatabaseState,
  ) => {
    entry.cachedAdventurePoints = cachedAdventurePointsForActivatableWithEnhancements(
      entry.value,
      entry.boundAdventurePoints,
      config.getImprovementCost(entry.id, database),
      Object.values(entry.enhancements).map(enhancement => enhancement.id),
      enhancementId =>
        config.getEnhancementAdventurePointsModifier(entry.id, enhancementId, database),
    )
    return entry
  }

  const create: ActivatableRatedWithEnhancementsSlice<N, E>["create"] = (
    database,
    id,
    value,
    { dependencies = [], boundAdventurePoints = [], enhancements = {} } = {},
  ) =>
    updateCachedAdventurePoints(
      {
        id,
        value: value === undefined ? undefined : Math.max(0, value),
        cachedAdventurePoints: {
          general: 0,
          bound: 0,
        },
        dependencies,
        boundAdventurePoints,
        enhancements,
      },
      database,
    )

  const createInitial: ActivatableRatedWithEnhancementsSlice<N, E>["createInitial"] = (
    id,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) => ({
    id,
    value: undefined,
    cachedAdventurePoints: {
      general: 0,
      bound: 0,
    },
    dependencies,
    boundAdventurePoints,
    enhancements: {},
  })

  const getValue: ActivatableRatedWithEnhancementsSlice<N, E>["getValue"] = entry => entry?.value

  const addAction = createAction<number, `${N}/add${E}`>(
    `${config.namespace}/add${config.entityName}`,
  )

  const removeAction = createAction<number, `${N}/remove${E}`>(
    `${config.namespace}/remove${config.entityName}`,
  )

  const incrementAction = createAction<number, `${N}/increment${E}`>(
    `${config.namespace}/increment${config.entityName}`,
  )

  const decrementAction = createAction<number, `${N}/decrement${E}`>(
    `${config.namespace}/decrement${config.entityName}`,
  )

  const reducer = createImmerReducer(
    (state: Draft<CharacterState>, action, database: DatabaseState) => {
      if (addAction.match(action)) {
        config.getState(state)[action.payload] ??= create(database, action.payload, 0)
      } else if (removeAction.match(action)) {
        delete config.getState(state)[action.payload]
      } else if (incrementAction.match(action)) {
        const entry = (config.getState(state)[action.payload] ??= createInitial(action.payload))
        if (entry.value === undefined) {
          entry.value = 0
        } else {
          entry.value++
        }
        updateCachedAdventurePoints(entry, database)
      } else if (decrementAction.match(action)) {
        const entry = config.getState(state)[action.payload]
        if (entry !== undefined && entry.value !== undefined && entry.value > 0) {
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
      addAction,
      removeAction,
      incrementAction,
      decrementAction,
    },
    reducer,
  }
}
