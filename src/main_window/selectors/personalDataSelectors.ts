import { createSelector } from "@reduxjs/toolkit"
import { EyeColor } from "optolith-database-schema/types/EyeColor"
import { HairColor } from "optolith-database-schema/types/HairColor"
import { Height, Weight } from "optolith-database-schema/types/Race"
import { SocialStatus } from "optolith-database-schema/types/SocialStatus"
import { isOptionActive } from "../../shared/domain/activatableEntry.ts"
import {
  DisadvantageIdentifier,
  EyeColorIdentifier,
  HairColorIdentifier,
} from "../../shared/domain/identifier.ts"
import { filterNonNullable, unique } from "../../shared/utils/array.ts"
import { compareAt, numAsc } from "../../shared/utils/compare.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectDisadvantages, selectSocialStatusDependencies } from "../slices/characterSlice.ts"
import { selectEyeColors, selectHairColors, selectSocialStatuses } from "../slices/databaseSlice.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
import { selectCurrentRace, selectCurrentRaceVariant } from "./raceSelectors.ts"

/**
 * Returns the social statuses that are available for the character based on
 * the culture.
 */
export const selectAvailableSocialStatuses = createSelector(
  selectCurrentCulture,
  selectSocialStatusDependencies,
  selectSocialStatuses,
  (currentCulture, socialStatusDependencies, socialStatuses): SocialStatus[] => {
    const minimumSocialStatus =
      socialStatusDependencies.length === 0
        ? 1
        : Math.max(...socialStatusDependencies.map(dep => dep.id))

    return Object.values(socialStatuses)
      .sort(compareAt(status => status.id, numAsc))
      .filter(
        status =>
          status.id >= minimumSocialStatus &&
          currentCulture?.social_status.some(ref => ref.id.social_status === status.id),
      )
  },
)

const ALBINO = 1
const GREEN_HAIR = 3

/**
 * Returns a array containing 20 hair color identifiers that mirror the
 * probabilities used for randomly rolling a die and that are available for the
 * character based on the race.
 */
export const selectAvailableHairColorsIdDice = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.Stigma),
  (currentRace, currentRaceVariant, stigma): number[] => {
    const isAlbino = isOptionActive(stigma, { type: "Generic", value: ALBINO })
    const isGreenHaired = isOptionActive(stigma, { type: "Generic", value: GREEN_HAIR })

    if (isAlbino || isGreenHaired) {
      return filterNonNullable([
        isAlbino ? HairColorIdentifier.White : undefined,
        isGreenHaired ? HairColorIdentifier.Green : undefined,
      ])
    } else if (currentRace === undefined) {
      return []
    } else {
      return (
        currentRaceVariant?.hair_color?.map(ref => ref.id.hair_color) ??
        (currentRace.variants.length === 1
          ? currentRace.variants[0]!.hair_color.map(ref => ref.id.hair_color)
          : [])
      )
    }
  },
)

/**
 * Returns the hair colors that are available for the character based on the
 * race.
 */
export const selectAvailableHairColors = createSelector(
  selectAvailableHairColorsIdDice,
  selectHairColors,
  (hairColorIds, hairColors): HairColor[] =>
    filterNonNullable(unique(hairColorIds).map(id => hairColors[id])),
)

/**
 * Returns a array containing 20 eye color identifiers that mirror the
 * probabilities used for randomly rolling a die and that are available for the
 * character based on the race.
 */
export const selectAvailableEyeColorsIdDice = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.Stigma),
  (currentRace, currentRaceVariant, stigma): number[] => {
    const isAlbino = isOptionActive(stigma, { type: "Generic", value: ALBINO })

    if (isAlbino) {
      const eyeColorIds = [EyeColorIdentifier.Red, EyeColorIdentifier.Purple]
      return eyeColorIds
    } else if (currentRace === undefined) {
      return []
    } else {
      return (
        currentRaceVariant?.eye_color?.map(ref => ref.id.eye_color) ??
        (currentRace.variants.length === 1
          ? currentRace.variants[0]!.eye_color.map(ref => ref.id.eye_color)
          : [])
      )
    }
  },
)

/**
 * Returns the eye colors that are available for the character based on the
 * race.
 */
export const selectAvailableEyeColors = createSelector(
  selectAvailableEyeColorsIdDice,
  selectEyeColors,
  (eyeColorIds, eyeColors): EyeColor[] =>
    filterNonNullable(unique(eyeColorIds).map(id => eyeColors[id])),
)

/**
 * Returns the configuration for random height generation.
 */
export const selectRandomHeightCalculation = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  (currentRace, currentRaceVariant): Height =>
    currentRaceVariant?.height ??
    (currentRace?.variants.length === 1
      ? currentRace.variants[0]!.height
      : { base: 0, random: [] }),
)

/**
 * Returns the configuration for random weight generation.
 */
export const selectRandomWeightCalculation = createSelector(
  selectCurrentRace,
  (currentRace): Weight => currentRace?.weight ?? { base: 0, random: [] },
)
