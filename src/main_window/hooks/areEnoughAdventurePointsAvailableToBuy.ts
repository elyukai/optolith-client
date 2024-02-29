import { CacheMap } from "optolith-database-schema/config/cache"
import { useCallback } from "react"
import {
  maximumAdventurePointsForAdventagesAndDisadvantages,
  maximumAdventurePointsForBlessedAdventagesAndDisadvantages,
} from "../../shared/domain/activatable/advantagesDisadvantages.ts"
import {
  AdventurePointsCache,
  getTotalAdventurePointsFromCache,
} from "../../shared/domain/adventurePoints/cache.ts"
import { Result, combine, error, ok } from "../../shared/utils/result.ts"
import { Translate } from "../../shared/utils/translate.ts"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import {
  selectAdventurePointsAvailable,
  selectAdventurePointsSpentOnAdvantages,
  selectAdventurePointsSpentOnBlessedAdvantages,
  selectAdventurePointsSpentOnBlessedDisadvantages,
  selectAdventurePointsSpentOnDisadvantages,
  selectAdventurePointsSpentOnMagicalAdvantages,
  selectAdventurePointsSpentOnMagicalDisadvantages,
} from "../selectors/adventurePointSelectors.ts"
import { selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "../selectors/traditionSelectors.ts"
import { Alert } from "../slices/alertsSlice.ts"
import { useAppSelector } from "./redux.ts"

type SpecialAdventurePointsKind =
  | "advantage"
  | "magicalAdvantage"
  | "blessedAdvantage"
  | "disadvantage"
  | "magicalDisadvantage"
  | "blessedDisadvantage"

/**
 * Result of an availability check. If the entry can be bought or increased,
 * the result is `Ok`. Otherwise, the result is `Err` and states the reason why
 * the entry cannot be bought or increased.
 */
export type AvailabilityCheckResult<T extends RejectionReason> = Result<number, T>

/**
 * Reason why the requested entry cannot be bought or increased. It states how
 * many adventure points are missing in which category.
 */
export type RejectionReason = GeneralRejectionReason | SpecialRejectionReason

/**
 * Reason: Not enough adventure points are available in general.
 */
export type GeneralRejectionReason = {
  kind: "general"
  missingValue: number
}

/**
 * Reason: Not enough adventure points are available for a specific advantage
 * or disadvantage category limit.
 */
export type SpecialRejectionReason = {
  kind: SpecialAdventurePointsKind
  limit: number
  missingValue: number
}

const checkGeneral = (
  value: number,
  available: number,
): AvailabilityCheckResult<GeneralRejectionReason> =>
  available >= value ? ok(value) : error({ kind: "general", missingValue: value - available })

const checkAvailable = (
  value: number,
  available: number,
  limit: number,
  kind: SpecialAdventurePointsKind,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  available >= value ? ok(value) : error({ kind, missingValue: value - available, limit })

const checkLimitAndSpent = (
  value: number,
  limit: number,
  spent: number,
  kind: SpecialAdventurePointsKind,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkAvailable(value, limit - spent, limit, kind)

const checkAdvantages = (
  value: number,
  spentOnAdvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    maximumAdventurePointsForAdventagesAndDisadvantages,
    getTotalAdventurePointsFromCache(spentOnAdvantages),
    "advantage",
  )

const checkMagicalAdvantages = (
  value: number,
  limit: number,
  spentOnMagicalAdvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    limit,
    getTotalAdventurePointsFromCache(spentOnMagicalAdvantages),
    "magicalAdvantage",
  )

const checkBlessedAdvantages = (
  value: number,
  spentOnBlessedAdvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    maximumAdventurePointsForBlessedAdventagesAndDisadvantages,
    getTotalAdventurePointsFromCache(spentOnBlessedAdvantages),
    "blessedAdvantage",
  )

const checkDisadvantages = (
  value: number,
  spentOnDisadvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    maximumAdventurePointsForAdventagesAndDisadvantages,
    -getTotalAdventurePointsFromCache(spentOnDisadvantages),
    "disadvantage",
  )

const checkMagicalDisadvantages = (
  value: number,
  limit: number,
  spentOnMagicalDisadvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    limit,
    -getTotalAdventurePointsFromCache(spentOnMagicalDisadvantages),
    "magicalDisadvantage",
  )

const checkBlessedDisadvantages = (
  value: number,
  spentOnBlessedDisadvantages: AdventurePointsCache,
): AvailabilityCheckResult<SpecialRejectionReason> =>
  checkLimitAndSpent(
    value,
    maximumAdventurePointsForBlessedAdventagesAndDisadvantages,
    -getTotalAdventurePointsFromCache(spentOnBlessedDisadvantages),
    "blessedDisadvantage",
  )

/**
 * Returns an alert object for the given rejection reason.
 */
export const getAlertForReason = (reason: RejectionReason, translate: Translate): Alert => {
  switch (reason.kind) {
    case "general":
      return {
        title: translate("Not enough AP"),
        description: translate(
          "You are missing {0} Adventure Points to do this.",
          reason.missingValue,
          reason.missingValue,
        ),
      }
    case "advantage":
      return {
        title: translate("Exceeding Adventure Points limit for advantages"),
        description: translate(
          "You cannot spend more than {0} AP on advantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    case "magicalAdvantage":
      return {
        title: translate("Exceeding Adventure Points limit for magical advantages"),
        description: translate(
          "You cannot spend more than {0} AP on magical advantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    case "blessedAdvantage":
      return {
        title: translate("Exceeding Adventure Points limit for blessed advantages"),
        description: translate(
          "You cannot spend more than {0} AP on blessed advantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    case "disadvantage":
      return {
        title: translate("Exceeding Adventure Points limit for disadvantages"),
        description: translate(
          "You cannot receive more than {0} AP from disadvantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    case "magicalDisadvantage":
      return {
        title: translate("Exceeding Adventure Points limit for magical disadvantages"),
        description: translate(
          "You cannot receive more than {0} AP from magical disadvantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    case "blessedDisadvantage":
      return {
        title: translate("Exceeding Adventure Points limit for blessed disadvantages"),
        description: translate(
          "You cannot receive more than {0} AP from blessed disadvantages. You would exceed this limit by {1} AP.",
          reason.limit,
          reason.missingValue,
        ),
      }
    default:
      return assertExhaustive(reason)
  }
}

const combineChecks = <T extends RejectionReason>(
  firstResult: AvailabilityCheckResult<T>,
  ...nextResults: AvailabilityCheckResult<T>[]
): AvailabilityCheckResult<T> =>
  nextResults.reduce(
    (acc, res) =>
      combine(
        acc,
        res,
        ok1 => ok1,
        err1 => err1,
      ),
    firstResult,
  )

/**
 * Custom hook that provides a function that checks whether enough adventure
 * points are available to buy or increase an entry.
 */
export const useAreEnoughAdventurePointsAvailableToBuy = () => {
  const available = useAppSelector(selectAdventurePointsAvailable)

  return useCallback(
    (value: number): AvailabilityCheckResult<GeneralRejectionReason> =>
      checkGeneral(value, available),
    [available],
  )
}

/**
 * Returns the special adventure points kind for the given advantage or
 * disadvantage identifier.
 */
export const getSpecialAdventurePointsKind = (
  cache: CacheMap["magicalAndBlessedAdvantagesAndDisadvantages"],
  kind: "advantage" | "disadvantage",
  id: number,
): SpecialAdventurePointsKind => {
  switch (kind) {
    case "advantage":
      if (cache.advantages.magical.ids.includes(id)) {
        return "magicalAdvantage"
      } else if (cache.advantages.blessed.ids.includes(id)) {
        return "blessedAdvantage"
      } else {
        return "advantage"
      }
    case "disadvantage":
      if (cache.disadvantages.magical.ids.includes(id)) {
        return "magicalDisadvantage"
      } else if (cache.disadvantages.blessed.ids.includes(id)) {
        return "blessedDisadvantage"
      } else {
        return "disadvantage"
      }
    default:
      return assertExhaustive(kind)
  }
}

/**
 * Custom hook that provides a function that checks whether enough adventure
 * points are available to buy or sell an advantage or disadvantage entry.
 */
export const useAreEnoughAdventurePointsAvailableToBuyAnAdvantageOrDisadvantage = () => {
  const maximumForMagicalAdvantagesDisadvantages = useAppSelector(
    selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
  )
  const available = useAppSelector(selectAdventurePointsAvailable)
  const spentOnAdvantages = useAppSelector(selectAdventurePointsSpentOnAdvantages)
  const spentOnMagicalAdvantages = useAppSelector(selectAdventurePointsSpentOnMagicalAdvantages)
  const spentOnBlessedAdvantages = useAppSelector(selectAdventurePointsSpentOnBlessedAdvantages)
  const spentOnDisadvantages = useAppSelector(selectAdventurePointsSpentOnDisadvantages)
  const spentOnMagicalDisadvantages = useAppSelector(
    selectAdventurePointsSpentOnMagicalDisadvantages,
  )
  const spentOnBlessedDisadvantages = useAppSelector(
    selectAdventurePointsSpentOnBlessedDisadvantages,
  )

  return useCallback(
    (
      value: number,
      kind?: SpecialAdventurePointsKind,
    ): AvailabilityCheckResult<RejectionReason> => {
      switch (kind) {
        case undefined:
          return checkGeneral(value, available)
        case "advantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkAdvantages(value, spentOnAdvantages),
          )
        case "magicalAdvantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkAdvantages(value, spentOnAdvantages),
            checkMagicalAdvantages(
              value,
              maximumForMagicalAdvantagesDisadvantages,
              spentOnMagicalAdvantages,
            ),
          )
        case "blessedAdvantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkAdvantages(value, spentOnAdvantages),
            checkBlessedAdvantages(value, spentOnBlessedAdvantages),
          )
        case "disadvantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkDisadvantages(-value, spentOnDisadvantages),
          )
        case "magicalDisadvantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkDisadvantages(-value, spentOnDisadvantages),
            checkMagicalDisadvantages(
              -value,
              maximumForMagicalAdvantagesDisadvantages,
              spentOnMagicalDisadvantages,
            ),
          )
        case "blessedDisadvantage":
          return combineChecks<RejectionReason>(
            checkGeneral(value, available),
            checkDisadvantages(-value, spentOnDisadvantages),
            checkBlessedDisadvantages(-value, spentOnBlessedDisadvantages),
          )
        default:
          return assertExhaustive(kind)
      }
    },
    [
      available,
      maximumForMagicalAdvantagesDisadvantages,
      spentOnAdvantages,
      spentOnBlessedAdvantages,
      spentOnBlessedDisadvantages,
      spentOnDisadvantages,
      spentOnMagicalAdvantages,
      spentOnMagicalDisadvantages,
    ],
  )
}
