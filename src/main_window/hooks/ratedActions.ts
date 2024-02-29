import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { useCallback } from "react"
import {
  ImprovementCost,
  adventurePointsForActivation,
  adventurePointsForIncrement,
  adventurePointsForRange,
} from "../../shared/domain/adventurePoints/improvementCost.ts"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { isOk } from "../../shared/utils/result.ts"
import { Translate } from "../../shared/utils/translate.ts"
import { showAlert } from "../slices/alertsSlice.ts"
import {
  getAlertForReason,
  useAreEnoughAdventurePointsAvailableToBuy,
} from "./areEnoughAdventurePointsAvailableToBuy.ts"
import { useAppDispatch } from "./redux.ts"

const useHandleAdd = (
  id: number,
  improvementCost: ImprovementCost,
  createAddAction: ActionCreatorWithPayload<{ id: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
  areEnoughAdventurePointsAvailableToBuy: ReturnType<
    typeof useAreEnoughAdventurePointsAvailableToBuy
  >,
  translate: Translate,
) =>
  useCallback((): void => {
    const enoughAP = areEnoughAdventurePointsAvailableToBuy(
      adventurePointsForActivation(improvementCost),
    )

    if (enoughAP !== undefined) {
      if (isOk(enoughAP)) {
        dispatch(createAddAction({ id }))
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
      }
    }
  }, [
    areEnoughAdventurePointsAvailableToBuy,
    createAddAction,
    dispatch,
    id,
    improvementCost,
    translate,
  ])

const useHandleAddPoint = (
  id: number,
  value: number,
  improvementCost: ImprovementCost,
  createIncrementAction: ActionCreatorWithPayload<{ id: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
  areEnoughAdventurePointsAvailableToBuy: ReturnType<
    typeof useAreEnoughAdventurePointsAvailableToBuy
  >,
  translate: Translate,
) =>
  useCallback((): void => {
    const enoughAP = areEnoughAdventurePointsAvailableToBuy(
      adventurePointsForIncrement(improvementCost, value),
    )

    if (enoughAP !== undefined) {
      if (isOk(enoughAP)) {
        dispatch(createIncrementAction({ id }))
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
      }
    }
  }, [
    areEnoughAdventurePointsAvailableToBuy,
    createIncrementAction,
    dispatch,
    id,
    improvementCost,
    translate,
    value,
  ])

const useHandleSetToMaximumPoints = (
  id: number,
  value: number,
  maximum: number,
  improvementCost: ImprovementCost,
  createSetAction: ActionCreatorWithPayload<{ id: number; value: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
  areEnoughAdventurePointsAvailableToBuy: ReturnType<
    typeof useAreEnoughAdventurePointsAvailableToBuy
  >,
  translate: Translate,
) =>
  useCallback((): void => {
    const enoughAP = areEnoughAdventurePointsAvailableToBuy(
      adventurePointsForRange(improvementCost, value, maximum),
    )

    if (enoughAP !== undefined) {
      if (isOk(enoughAP)) {
        dispatch(createSetAction({ id, value: maximum }))
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
      }
    }
  }, [
    areEnoughAdventurePointsAvailableToBuy,
    createSetAction,
    dispatch,
    id,
    improvementCost,
    maximum,
    translate,
    value,
  ])

const useHandleSetToMinimumPoints = (
  id: number,
  minimum: number,
  createSetAction: ActionCreatorWithPayload<{ id: number; value: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
) =>
  useCallback((): void => {
    dispatch(createSetAction({ id, value: minimum }))
  }, [createSetAction, dispatch, id, minimum])

const useHandleRemovePoint = (
  id: number,
  createDecrementAction: ActionCreatorWithPayload<{ id: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
) =>
  useCallback(() => {
    dispatch(createDecrementAction({ id }))
  }, [createDecrementAction, dispatch, id])

const useHandleRemove = (
  id: number,
  createRemoveAction: ActionCreatorWithPayload<{ id: number }>,
  dispatch: ReturnType<typeof useAppDispatch>,
) =>
  useCallback(() => {
    dispatch(createRemoveAction({ id }))
  }, [createRemoveAction, dispatch, id])

/**
 * Returns a set of callbacks for interaction with rated entries.
 */
export const useRatedActions = (
  id: number,
  value: number,
  maximum: number,
  minimum: number,
  improvementCost: ImprovementCost,
  createIncrementAction: ActionCreatorWithPayload<{ id: number }>,
  createDecrementAction: ActionCreatorWithPayload<{ id: number }>,
  createSetAction: ActionCreatorWithPayload<{ id: number; value: number }>,
) => {
  const dispatch = useAppDispatch()
  const areEnoughAdventurePointsAvailableToBuy = useAreEnoughAdventurePointsAvailableToBuy()
  const translate = useTranslate()

  const handleAddPoint = useHandleAddPoint(
    id,
    value,
    improvementCost,
    createIncrementAction,
    dispatch,
    areEnoughAdventurePointsAvailableToBuy,
    translate,
  )

  const handleSetToMaximumPoints = useHandleSetToMaximumPoints(
    id,
    value,
    maximum,
    improvementCost,
    createSetAction,
    dispatch,
    areEnoughAdventurePointsAvailableToBuy,
    translate,
  )

  const handleSetToMinimumPoints = useHandleSetToMinimumPoints(
    id,
    minimum,
    createSetAction,
    dispatch,
  )

  const handleRemovePoint = useHandleRemovePoint(id, createDecrementAction, dispatch)

  return {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
  }
}

/**
 * Returns a set of callbacks for interaction with active activatable rated
 * entries.
 */
export const useActiveActivatableActions = (
  id: number,
  value: number,
  maximum: number,
  minimum: number,
  improvementCost: ImprovementCost,
  createIncrementAction: ActionCreatorWithPayload<{ id: number }>,
  createDecrementAction: ActionCreatorWithPayload<{ id: number }>,
  createSetAction: ActionCreatorWithPayload<{ id: number; value: number }>,
  createRemoveAction: ActionCreatorWithPayload<{ id: number }>,
) => {
  const dispatch = useAppDispatch()
  const areEnoughAdventurePointsAvailableToBuy = useAreEnoughAdventurePointsAvailableToBuy()
  const translate = useTranslate()

  const handleAddPoint = useHandleAddPoint(
    id,
    value,
    improvementCost,
    createIncrementAction,
    dispatch,
    areEnoughAdventurePointsAvailableToBuy,
    translate,
  )

  const handleSetToMaximumPoints = useHandleSetToMaximumPoints(
    id,
    value,
    maximum,
    improvementCost,
    createSetAction,
    dispatch,
    areEnoughAdventurePointsAvailableToBuy,
    translate,
  )

  const handleSetToMinimumPoints = useHandleSetToMinimumPoints(
    id,
    minimum,
    createSetAction,
    dispatch,
  )

  const handleRemovePoint = useHandleRemovePoint(id, createDecrementAction, dispatch)

  const handleRemove = useHandleRemove(id, createRemoveAction, dispatch)

  return {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  }
}

/**
 * Returns a set of callbacks for interaction with inactive activatable rated
 * entries.
 */
export const useInactiveActivatableActions = (
  id: number,
  improvementCost: ImprovementCost,
  createAddAction: ActionCreatorWithPayload<{ id: number }>,
) => {
  const dispatch = useAppDispatch()
  const areEnoughAdventurePointsAvailableToBuy = useAreEnoughAdventurePointsAvailableToBuy()
  const translate = useTranslate()

  const handleAdd = useHandleAdd(
    id,
    improvementCost,
    createAddAction,
    dispatch,
    areEnoughAdventurePointsAvailableToBuy,
    translate,
  )

  return {
    handleAdd,
  }
}
