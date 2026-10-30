import { unique } from "@elyukai/utils/array/filters"
import { isNotNullish } from "@elyukai/utils/nullable"
import {
  EyeColor,
  HairColor,
  Weight,
  type RandomHeightGeneration,
} from "@optolith/database-schema/gen"
import {
  DisadvantageIdentifier,
  EyeColorIdentifier,
  HairColorIdentifier,
} from "@optolith/database-schema/types/_Identifier"
import { createSelector } from "@reduxjs/toolkit"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectDynamicDisadvantages } from "../slices/characterSlice.ts"
import { selectStaticEyeColors, selectStaticHairColors } from "../slices/databaseSlice.ts"

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
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.Stigma),
  (currentRace, currentRaceVariant, stigma): number[] => {
    const isAlbino = isOptionActive(stigma, { tag: "General", general: ALBINO })
    const isGreenHaired = isOptionActive(stigma, { tag: "General", general: GREEN_HAIR })

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
  selectStaticHairColors,
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
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.Stigma),
  (currentRace, currentRaceVariant, stigma): number[] => {
    const isAlbino = isOptionActive(stigma, { tag: "General", general: ALBINO })

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
  selectStaticEyeColors,
  (eyeColorIds, eyeColors): EyeColor[] =>
    unique(eyeColorIds)
      .map(id => eyeColors[id])
      .filter(isNotNullish),
)

/**
 * Returns the configuration for random height generation.
 */
export const selectRandomHeightCalculation = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  (currentRace, currentRaceVariant): RandomHeightGeneration =>
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
