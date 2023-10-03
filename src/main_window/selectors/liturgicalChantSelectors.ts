import {
  selectAdvantages,
  selectAttributes,
  selectCloseCombatTechniques,
  selectBlessings as selectDynamicBlessings,
  selectCeremonies as selectDynamicCeremonies,
  selectLiturgicalChants as selectDynamicLiturgicalChants,
  selectKarmaSpecialAbilities,
  selectLiturgicalStyleSpecialAbilities,
  selectRangedCombatTechniques,
  selectRituals,
  selectSkills,
  selectSpells,
} from "../slices/characterSlice.ts"
import {
  selectBlessings as selectStaticBlessings,
  selectCeremonies as selectStaticCeremonies,
  selectLiturgicalChants as selectStaticLiturgicalChants,
} from "../slices/databaseSlice.ts"

import { createSelector } from "@reduxjs/toolkit"
import { getOptions } from "../../shared/domain/activatableEntry.ts"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
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
} from "../../shared/domain/liturgicalChant.ts"
import {
  DisplayedActiveBlessing,
  DisplayedActiveCeremony,
  DisplayedActiveLiturgicalChant,
  DisplayedActiveLiturgy,
  getActiveLiturgicalChantsOrCeremonies,
} from "../../shared/domain/liturgicalChantActive.ts"
import {
  DisplayedInactiveBlessing,
  DisplayedInactiveCeremony,
  DisplayedInactiveLiturgicalChant,
  DisplayedInactiveLiturgy,
  filterInactiveBlessings,
  getInactiveLiturgicalChantsOrCeremonies,
} from "../../shared/domain/liturgicalChantInactive.ts"
import { partition } from "../../shared/utils/array.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
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
    selectKarmaSpecialAbilities,
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
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectAttributes,
  selectSkills,
  selectCloseCombatTechniques,
  selectRangedCombatTechniques,
  selectSpells,
  selectRituals,
  selectDynamicCeremonies,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  (
    staticLiturgicalChants,
    dynamicLiturgicalChants,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    skills,
    closeCombatTechniques,
    rangedCombatTechniques,
    spells,
    rituals,
    ceremonies,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
  ): DisplayedActiveLiturgicalChant[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes,
      skills,
      closeCombatTechniques,
      rangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants: dynamicLiturgicalChants,
      ceremonies,
    })

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
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectAttributes,
  selectSkills,
  selectCloseCombatTechniques,
  selectRangedCombatTechniques,
  selectSpells,
  selectRituals,
  selectDynamicLiturgicalChants,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  (
    staticCeremonies,
    dynamicCeremonies,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    skills,
    closeCombatTechniques,
    rangedCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
  ): DisplayedActiveCeremony[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes,
      skills,
      closeCombatTechniques,
      rangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants,
      ceremonies: dynamicCeremonies,
    })

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
  (activeCount, isInCharacterCreation, startExperienceLevel) => {
    if (startExperienceLevel === undefined) {
      return true
    }

    return isMaximumOfLiturgicalChantsReached(
      activeCount,
      isInCharacterCreation,
      startExperienceLevel,
    )
  },
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
    selectLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.BirdsOfPassage,
  ),
  createPropertySelector(
    selectLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.HuntressesOfTheWhiteMaiden,
  ),
  createPropertySelector(
    selectLiturgicalStyleSpecialAbilities,
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
    selectLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.BirdsOfPassage,
  ),
  createPropertySelector(
    selectLiturgicalStyleSpecialAbilities,
    LiturgicalStyleSpecialAbilityIdentifier.HuntressesOfTheWhiteMaiden,
  ),
  createPropertySelector(
    selectLiturgicalStyleSpecialAbilities,
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
 * value bounds, and full logic for if the value can be increased or decreased.
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
