import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { useCallback } from "react"
import {
  DisplayedActiveActivatable,
  getCostDifferenceOnRemove,
  getCostOfInstance,
} from "../../shared/domain/activatable/activatableActive.ts"
import { ActivatableInstance } from "../../shared/domain/activatable/activatableEntry.ts"
import { equalsIdentifier } from "../../shared/domain/identifier.ts"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { removeIndex } from "../../shared/utils/array.ts"
import { isOk } from "../../shared/utils/result.ts"
import { selectGetSelectOptionsById } from "../selectors/activatableSelectors.ts"
import { showAlert } from "../slices/alertsSlice.ts"
import { selectMagicalAndBlessedAdvantagesAndDisadvantagesCache } from "../slices/databaseSlice.ts"
import {
  AvailabilityCheckResult,
  RejectionReason,
  getAlertForReason,
  getSpecialAdventurePointsKind,
  useAreEnoughAdventurePointsAvailableToBuy,
  useAreEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage,
} from "./areEnoughAdventurePointsAvailableToBuy.ts"
import { useAppDispatch, useAppSelector } from "./redux.ts"

/**
 * Returns a set of callbacks for interaction with inactive activatable entries.
 */
export const useInactiveActivatableActions = (
  createAddAction: ActionCreatorWithPayload<{ id: number; instance: ActivatableInstance }>,
  areEnoughAdventurePointsAvailableToBuy: (
    id: number,
    cost: number,
  ) => AvailabilityCheckResult<RejectionReason>,
) => {
  const dispatch = useAppDispatch()
  const translate = useTranslate()

  const handleAdd = useCallback(
    (params: { id: number; instance: ActivatableInstance }, cost: number) => {
      const enoughAP = areEnoughAdventurePointsAvailableToBuy(params.id, cost)

      if (isOk(enoughAP)) {
        dispatch(createAddAction(params))
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
      }
    },
    [areEnoughAdventurePointsAvailableToBuy, createAddAction, dispatch, translate],
  )

  return {
    handleAdd,
  }
}

/**
 * Returns a set of callbacks for interaction with inactive special ability
 * entries.
 */
export const useInactiveSpecialAbilityActions = (
  createAddAction: ActionCreatorWithPayload<{ id: number; instance: ActivatableInstance }>,
) => {
  const areEnoughAdventurePointsAvailableToBuy = useAreEnoughAdventurePointsAvailableToBuy()

  return useInactiveActivatableActions(createAddAction, (_id, cost) =>
    areEnoughAdventurePointsAvailableToBuy(cost),
  )
}

/**
 * Returns a set of callbacks for interaction with inactive advantage and
 * disadvantage entries.
 */
export const useInactiveAdvantageAndDisadvantageActions = (
  kind: "advantage" | "disadvantage",
  createAddAction: ActionCreatorWithPayload<{ id: number; instance: ActivatableInstance }>,
) => {
  const areEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage =
    useAreEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage()

  const magicalAndBlessedAdvantagesAndDisadvantagesCache = useAppSelector(
    selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  )

  return useInactiveActivatableActions(createAddAction, (id, cost) =>
    areEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage(
      cost,
      getSpecialAdventurePointsKind(magicalAndBlessedAdvantagesAndDisadvantagesCache, kind, id),
    ),
  )
}

const useActiveActivatableActions = (
  createRemoveAction: ActionCreatorWithPayload<{ id: number; index: number }>,
  createChangeLevelAction: ActionCreatorWithPayload<{ id: number; index: number; level: number }>,
  createIdObject: (id: number) => ActivatableIdentifier,
  areEnoughAdventurePointsAvailableToBuy: (
    id: number,
    cost: number,
  ) => AvailabilityCheckResult<RejectionReason>,
) => {
  const dispatch = useAppDispatch()
  const translate = useTranslate()

  const handleRemove = useCallback(
    (
      params: { id: number; index: number },
      activeEntry: DisplayedActiveActivatable<string, unknown>,
    ) => {
      const previousLevelCostDifference = getCostDifferenceOnRemove(activeEntry.cost)
      const enoughAP = areEnoughAdventurePointsAvailableToBuy(
        params.id,
        previousLevelCostDifference,
      )

      if (isOk(enoughAP)) {
        dispatch(createRemoveAction(params))
        return true
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
        return false
      }
    },
    [areEnoughAdventurePointsAvailableToBuy, createRemoveAction, dispatch, translate],
  )

  const getSelectOptionsById = useAppSelector(selectGetSelectOptionsById)

  const handleChangeLevel = useCallback(
    (
      params: { id: number; index: number; level: number },
      activeEntry: DisplayedActiveActivatable<string, { ap_value: AdventurePointsValue | number }>,
    ): boolean => {
      const idObject = createIdObject(params.id)
      const previousLevelCostDifference = getCostDifferenceOnRemove(activeEntry.cost)
      const nextLevelCost = getCostOfInstance(
        idObject,
        typeof activeEntry.static.ap_value === "number"
          ? { tag: "Fixed", fixed: activeEntry.static.ap_value }
          : activeEntry.static.ap_value,
        removeIndex(activeEntry.dynamic.instances, activeEntry.instanceIndex),
        activeEntry.dynamic.instances[activeEntry.instanceIndex]!,
        optionId => getSelectOptionsById(idObject)?.find(opt => equalsIdentifier(opt.id, optionId)),
        true,
      )

      const enoughAP = areEnoughAdventurePointsAvailableToBuy(
        params.id,
        (nextLevelCost ?? 0) - previousLevelCostDifference,
      )

      if (isOk(enoughAP)) {
        dispatch(createChangeLevelAction(params))
        return true
      } else {
        dispatch(showAlert(getAlertForReason(enoughAP.error, translate)))
        return false
      }
    },
    [
      areEnoughAdventurePointsAvailableToBuy,
      createChangeLevelAction,
      createIdObject,
      dispatch,
      getSelectOptionsById,
      translate,
    ],
  )

  return {
    handleRemove,
    handleChangeLevel,
  }
}

/**
 * Returns a set of callbacks for interaction with active activatable entries.
 */
export const useActiveSpecialAbilityActions = (
  createRemoveAction: ActionCreatorWithPayload<{ id: number; index: number }>,
  createChangeLevelAction: ActionCreatorWithPayload<{ id: number; index: number; level: number }>,
  createIdObject: (id: number) => ActivatableIdentifier,
) => {
  const areEnoughAdventurePointsAvailableToBuy = useAreEnoughAdventurePointsAvailableToBuy()

  return useActiveActivatableActions(
    createRemoveAction,
    createChangeLevelAction,
    createIdObject,
    (_id, cost) => areEnoughAdventurePointsAvailableToBuy(cost),
  )
}

/**
 * Returns a set of callbacks for interaction with inactive advantage and
 * disadvantage entries.
 */
export const useActiveAdvantageAndDisadvantageActions = (
  kind: "advantage" | "disadvantage",
  createRemoveAction: ActionCreatorWithPayload<{ id: number; index: number }>,
  createChangeLevelAction: ActionCreatorWithPayload<{ id: number; index: number; level: number }>,
  createIdObject: (id: number) => ActivatableIdentifier,
) => {
  const areEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage =
    useAreEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage()

  const magicalAndBlessedAdvantagesAndDisadvantagesCache = useAppSelector(
    selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  )

  return useActiveActivatableActions(
    createRemoveAction,
    createChangeLevelAction,
    createIdObject,
    (id, cost) =>
      areEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage(
        cost,
        getSpecialAdventurePointsKind(magicalAndBlessedAdvantagesAndDisadvantagesCache, kind, id),
      ),
  )
}
