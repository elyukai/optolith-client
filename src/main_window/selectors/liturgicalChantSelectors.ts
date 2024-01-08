import { createSelector } from "@reduxjs/toolkit"
import {
  getOptions,
  isTinyActivatableActive,
} from "../../shared/domain/activatable/activatableEntry.ts"
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
import {
  selectDynamicAdvantages,
  selectDynamicKarmaSpecialAbilities,
  selectDynamicLiturgicalStyleSpecialAbilities,
} from "../slices/characterSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"
import { selectActiveBlessedTradition } from "./traditionSelectors.ts"

const selectLiturgicalChantsAbove10ByAspect = createSelector(
  SelectGetById.Static.LiturgicalChant,
  SelectGetById.Static.Ceremony,
  SelectAll.Dynamic.LiturgicalChants,
  SelectAll.Dynamic.Ceremonies,
  (
    getStaticLiturgicalChantById,
    getStaticCeremonyById,
    dynamicLiturgicalChants,
    dynamicCeremonies,
  ) =>
    getLiturgicalChantsAbove10ByAspect(
      id =>
        (id.tag === "LiturgicalChant"
          ? getStaticLiturgicalChantById(id.liturgical_chant)
          : getStaticCeremonyById(id.ceremony)
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
  SelectAll.Static.Blessings,
  SelectGetById.Dynamic.Blessing,
  (
    staticBlessings,
    getDynamicBlessingById,
  ): [active: DisplayedActiveBlessing[], inactive: DisplayedActiveBlessing[]] =>
    partition(
      staticBlessings.map(blessing => ({ kind: "blessing", static: blessing })),
      staticBlessing => isTinyActivatableActive(getDynamicBlessingById(staticBlessing.static.id)),
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
  SelectGetById.Static.LiturgicalChant,
  SelectAll.Dynamic.LiturgicalChants,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  SelectGetById.Dynamic.Attribute,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  selectFilterApplyingRatedDependencies,
  (
    getStaticLiturgicalChantById,
    dynamicLiturgicalChants,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    getDynamicAttributeById,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
    filterApplyingDependencies,
  ): DisplayedActiveLiturgicalChant[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveLiturgicalChantsOrCeremonies(
      "liturgicalChant",
      getStaticLiturgicalChantById,
      dynamicLiturgicalChants,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      getDynamicAttributeById,
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
  SelectGetById.Static.Ceremony,
  SelectAll.Dynamic.Ceremonies,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  SelectGetById.Dynamic.Attribute,
  selectLiturgicalChantsAbove10ByAspect,
  selectActiveAspectKnowledges,
  selectFilterApplyingRatedDependencies,
  (
    getStaticCeremonyById,
    dynamicCeremonies,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    getDynamicAttributeById,
    liturgicalChantsAbove10ByAspect,
    activeAspectKnowledges,
    filterApplyingDependencies,
  ): DisplayedActiveCeremony[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveLiturgicalChantsOrCeremonies(
      "ceremony",
      getStaticCeremonyById,
      dynamicCeremonies,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      getDynamicAttributeById,
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
  SelectAll.Dynamic.LiturgicalChants,
  SelectAll.Dynamic.Ceremonies,
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
  SelectAll.Dynamic.LiturgicalChants,
  SelectGetById.Static.LiturgicalChant,
  selectActiveBlessedTradition,
  (
    dynamicLiturgicalChants,
    getStaticLiturgicalChantById,
    activeBlessedTradition,
  ): { [traditionId: number]: number } =>
    activeBlessedTradition === undefined
      ? {}
      : countActiveByUnfamiliarTradition(
          dynamicLiturgicalChants,
          getStaticLiturgicalChantById,
          activeBlessedTradition.static,
        ),
)

const selectActiveCeremoniesCountByUnfamiliarTradition = createSelector(
  SelectAll.Dynamic.Ceremonies,
  SelectGetById.Static.Ceremony,
  selectActiveBlessedTradition,
  (
    dynamicCeremonies,
    getStaticCeremonyById,
    activeBlessedTradition,
  ): { [traditionId: number]: number } =>
    activeBlessedTradition === undefined
      ? {}
      : countActiveByUnfamiliarTradition(
          dynamicCeremonies,
          getStaticCeremonyById,
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
  SelectAll.Static.LiturgicalChants,
  SelectGetById.Dynamic.LiturgicalChant,
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
    getDynamicLiturgicalChantById,
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
      getDynamicLiturgicalChantById,
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
  SelectAll.Static.Ceremonies,
  SelectGetById.Dynamic.Ceremony,
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
    getDynamicCeremonyById,
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
      getDynamicCeremonyById,
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
