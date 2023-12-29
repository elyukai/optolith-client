import {
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicBlessings,
  selectDynamicCeremonies,
  selectDynamicKarmaSpecialAbilities,
  selectDynamicLiturgicalChants,
  selectDynamicLiturgicalStyleSpecialAbilities,
} from "../slices/characterSlice.ts"
import {
  selectStaticBlessings,
  selectStaticCeremonies,
  selectStaticLiturgicalChants,
} from "../slices/databaseSlice.ts"

import { createSelector } from "@reduxjs/toolkit"
import { getOptions } from "../../shared/domain/activatable/activatableEntry.ts"
import {
  AdvantageIdentifier,
  KarmaSpecialAbilityIdentifier,
  LiturgicalStyleSpecialAbilityIdentifier,
} from "../../shared/domain/identifier.ts"
import {
  countActiveByUnfamiliarTradition,
  countActiveLiturgicalChants,
  getLiturgicalChantsAbove10ByAspect,
  isMaximumOfLiturgicalChantsReached,
} from "../../shared/domain/rated/liturgicalChant.ts"
import {
  DisplayedActiveBlessing,
  DisplayedActiveCeremony,
  DisplayedActiveLiturgicalChant,
  DisplayedActiveLiturgy,
  getActiveLiturgicalChantsOrCeremonies,
} from "../../shared/domain/rated/liturgicalChantActive.ts"
import {
  DisplayedInactiveBlessing,
  DisplayedInactiveCeremony,
  DisplayedInactiveLiturgicalChant,
  DisplayedInactiveLiturgy,
  filterInactiveBlessings,
  getInactiveLiturgicalChantsOrCeremonies,
} from "../../shared/domain/rated/liturgicalChantInactive.ts"
import { partition } from "../../shared/utils/array.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"
import { selectActiveBlessedTradition } from "./traditionSelectors.ts"

const selectLiturgicalChantsAbove10ByAspect = createSelector(
  selectStaticLiturgicalChants,
  selectStaticCeremonies,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  (staticLiturgicalChants, staticCeremonies, dynamicLiturgicalChants, dynamicCeremonies) =>
    getLiturgicalChantsAbove10ByAspect(
      id =>
        (id.tag === "LiturgicalChant"
          ? staticLiturgicalChants[id.liturgical_chant]
          : staticCeremonies[id.ceremony]
        )?.traditions ?? [],
      dynamicLiturgicalChants,
      dynamicCeremonies,
    ),
)

const selectActiveAspectKnowledges = createSelector(
  createPropertySelector(
    selectDynamicKarmaSpecialAbilities,
    KarmaSpecialAbilityIdentifier.AspectKnowledge,
  ),
  aspectKnowledge =>
    getOptions(aspectKnowledge).flatMap(option =>
      option.type === "Predefined" && option.id.type === "Aspect" ? [option.id.value] : [],
    ),
)

/**
 * Returns the blessings, split by active and inactive.
 */
export const selectVisibleBlessings = createSelector(
  selectStaticBlessings,
  selectDynamicBlessings,
  (
    staticBlessings,
    dynamicBlessings,
  ): [active: DisplayedActiveBlessing[], inactive: DisplayedActiveBlessing[]] =>
    partition(
      Object.values(staticBlessings).map(blessing => ({ kind: "blessing", static: blessing })),
      staticBlessing => dynamicBlessings.includes(staticBlessing.static.id),
    ),
)

/**
 * Returns the active blessings for combination with other types.
 */
export const selectVisibleActiveBlessings = createSelector(
  selectVisibleBlessings,
  (visibleBlessings): DisplayedActiveBlessing[] => visibleBlessings[0],
)

/**
 * Returns all liturgical chants with their corresponding dynamic entries,
 * extended by value bounds, and full logic for if the value can be increased or
 * decreased.
 */
export const selectVisibleActiveLiturgicalChants = createSelector(
  selectStaticLiturgicalChants,
  selectDynamicLiturgicalChants,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectDynamicAttributes,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  selectFilterApplyingRatedDependencies,
  (
    staticLiturgicalChants,
    dynamicLiturgicalChants,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
    filterApplyingDependencies,
  ): DisplayedActiveLiturgicalChant[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveLiturgicalChantsOrCeremonies(
      "liturgicalChant",
      staticLiturgicalChants,
      dynamicLiturgicalChants,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      id => attributes[id],
      filterApplyingDependencies,
      liturgicalChantsAbove10ByAspect,
      activeAspectKnowledges,
    )
  },
)

/**
 * Returns all ceremonies with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveCeremonies = createSelector(
  selectStaticCeremonies,
  selectDynamicCeremonies,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectDynamicAttributes,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  selectFilterApplyingRatedDependencies,
  (
    staticCeremonies,
    dynamicCeremonies,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
    filterApplyingDependencies,
  ): DisplayedActiveCeremony[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveLiturgicalChantsOrCeremonies(
      "ceremony",
      staticCeremonies,
      dynamicCeremonies,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      id => attributes[id],
      filterApplyingDependencies,
      liturgicalChantsAbove10ByAspect,
      activeAspectKnowledges,
    )
  },
)

/**
 * Returns all liturgies with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveLiturgies = createSelector(
  selectVisibleActiveBlessings,
  selectVisibleActiveLiturgicalChants,
  selectVisibleActiveCeremonies,
  (blessings, liturgicalChants, ceremonies): DisplayedActiveLiturgy[] => [
    ...blessings,
    ...liturgicalChants,
    ...ceremonies,
  ],
)

/**
 * Returns the inactive blessings for combination with other types.
 */
export const selectVisibleInactiveBlessings = createSelector(
  selectVisibleBlessings,
  selectActiveBlessedTradition,
  (visibleBlessings, activeTradition): DisplayedInactiveBlessing[] => {
    if (activeTradition === undefined) {
      return []
    }

    return filterInactiveBlessings(visibleBlessings[1], activeTradition)
  },
)

const selectActiveLiturgicalChantsCount = createSelector(
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  countActiveLiturgicalChants,
)

const selectIsMaximumOfLiturgicalChantsReached = createSelector(
  selectActiveLiturgicalChantsCount,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  (activeCount, isInCharacterCreation, startExperienceLevel) =>
    startExperienceLevel === undefined ||
    isMaximumOfLiturgicalChantsReached(activeCount, isInCharacterCreation, startExperienceLevel),
)

const selectActiveLiturgicalChantsCountByUnfamiliarTradition = createSelector(
  selectDynamicLiturgicalChants,
  selectStaticLiturgicalChants,
  selectActiveBlessedTradition,
  (
    dynamicLiturgicalChants,
    staticLiturgicalChants,
    activeBlessedTradition,
  ): { [traditionId: number]: number } =>
    activeBlessedTradition === undefined
      ? {}
      : countActiveByUnfamiliarTradition(
          dynamicLiturgicalChants,
          staticLiturgicalChants,
          activeBlessedTradition.static,
        ),
)

const selectActiveCeremoniesCountByUnfamiliarTradition = createSelector(
  selectDynamicCeremonies,
  selectStaticCeremonies,
  selectActiveBlessedTradition,
  (
    dynamicCeremonies,
    staticCeremonies,
    activeBlessedTradition,
  ): { [traditionId: number]: number } =>
    activeBlessedTradition === undefined
      ? {}
      : countActiveByUnfamiliarTradition(
          dynamicCeremonies,
          staticCeremonies,
          activeBlessedTradition.static,
        ),
)

const selectActiveLiturgicalChantsAndCeremoniesCountByUnfamiliarTradition = createSelector(
  selectActiveLiturgicalChantsCountByUnfamiliarTradition,
  selectActiveCeremoniesCountByUnfamiliarTradition,
  (
    activeUnfamiliarLiturgicalChantsCount,
    activeUnfamiliarCeremoniesCount,
  ): { [traditionId: number]: number } =>
    Object.entries(activeUnfamiliarCeremoniesCount).reduce(
      (acc, [traditionId, count]) => ({
        ...acc,
        [traditionId]: count + (acc[Number.parseInt(traditionId, 10)] ?? 0),
      }),
      activeUnfamiliarLiturgicalChantsCount,
    ),
)

const selectUnfamiliarTraditionsWithHighestActiveCount = createSelector(
  selectActiveLiturgicalChantsAndCeremoniesCountByUnfamiliarTradition,
  (activeUnfamiliarCount): number[] =>
    Object.entries(activeUnfamiliarCount)
      .reduce<{ count: number; traditions: string[] }>(
        (acc, [traditionId, count]) =>
          count > acc.count
            ? { count, traditions: [traditionId] }
            : count === acc.count
            ? { count, traditions: [...acc.traditions, traditionId] }
            : acc,
        { count: 0, traditions: [] },
      )
      .traditions.map(traditionId => Number.parseInt(traditionId, 10)),
)

/**
 * Returns all liturgical chants with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveLiturgicalChants = createSelector(
  selectStaticLiturgicalChants,
  selectDynamicLiturgicalChants,
  selectActiveBlessedTradition,
  selectIsMaximumOfLiturgicalChantsReached,
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.BirdsOfPassage,
  ),
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.HuntressesOfTheWhiteMaiden,
  ),
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.FollowersOfTheGoldenOne,
  ),
  selectIsEntryAvailable,
  selectActiveLiturgicalChantsCountByUnfamiliarTradition,
  selectActiveLiturgicalChantsAndCeremoniesCountByUnfamiliarTradition,
  selectUnfamiliarTraditionsWithHighestActiveCount,
  (
    staticLiturgicalChants,
    dynamicLiturgicalChants,
    activeBlessedTradition,
    isMaximumCountReached,
    birdsOfPassage,
    huntressesOfTheWhiteMaiden,
    followersOfTheGoldenOne,
    isEntryAvailable,
    activeUnfamiliarLiturgicalChantsCount,
    activeUnfamiliarLiturgicalChantsAndCeremoniesCount,
    unfamiliarTraditionsWithHighestActiveCount,
  ): DisplayedInactiveLiturgicalChant[] => {
    if (activeBlessedTradition === undefined) {
      return []
    }

    return getInactiveLiturgicalChantsOrCeremonies(
      "liturgicalChant",
      staticLiturgicalChants,
      dynamicLiturgicalChants,
      activeBlessedTradition,
      isMaximumCountReached,
      birdsOfPassage,
      huntressesOfTheWhiteMaiden,
      followersOfTheGoldenOne,
      isEntryAvailable,
      activeUnfamiliarLiturgicalChantsCount,
      activeUnfamiliarLiturgicalChantsAndCeremoniesCount,
      unfamiliarTraditionsWithHighestActiveCount,
    )
  },
)

/**
 * Returns all ceremonies with their corresponding dynamic entries, extended by
 * whether the entry can be activated.
 */
export const selectVisibleInactiveCeremonies = createSelector(
  selectStaticCeremonies,
  selectDynamicCeremonies,
  selectActiveBlessedTradition,
  selectIsMaximumOfLiturgicalChantsReached,
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.BirdsOfPassage,
  ),
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.HuntressesOfTheWhiteMaiden,
  ),
  createPropertySelector(
    selectDynamicLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.FollowersOfTheGoldenOne,
  ),
  selectIsEntryAvailable,
  selectActiveCeremoniesCountByUnfamiliarTradition,
  selectActiveLiturgicalChantsAndCeremoniesCountByUnfamiliarTradition,
  selectUnfamiliarTraditionsWithHighestActiveCount,
  (
    staticCeremonies,
    dynamicCeremonies,
    activeBlessedTradition,
    isMaximumCountReached,
    birdsOfPassage,
    huntressesOfTheWhiteMaiden,
    followersOfTheGoldenOne,
    isEntryAvailable,
    activeUnfamiliarCeremoniesCount,
    activeUnfamiliarLiturgicalChantsAndCeremoniesCount,
    unfamiliarTraditionsWithHighestActiveCount,
  ): DisplayedInactiveCeremony[] => {
    if (activeBlessedTradition === undefined) {
      return []
    }

    return getInactiveLiturgicalChantsOrCeremonies(
      "ceremony",
      staticCeremonies,
      dynamicCeremonies,
      activeBlessedTradition,
      isMaximumCountReached,
      birdsOfPassage,
      huntressesOfTheWhiteMaiden,
      followersOfTheGoldenOne,
      isEntryAvailable,
      activeUnfamiliarCeremoniesCount,
      activeUnfamiliarLiturgicalChantsAndCeremoniesCount,
      unfamiliarTraditionsWithHighestActiveCount,
    )
  },
)

/**
 * Returns all liturgies with their corresponding dynamic entries, extended by
 * whether the entry can be activated.
 */
export const selectVisibleInactiveLiturgies = createSelector(
  selectVisibleInactiveBlessings,
  selectVisibleInactiveLiturgicalChants,
  selectVisibleInactiveCeremonies,
  (blessings, liturgicalChants, ceremonies): DisplayedInactiveLiturgy[] => [
    ...blessings,
    ...liturgicalChants,
    ...ceremonies,
  ],
)
