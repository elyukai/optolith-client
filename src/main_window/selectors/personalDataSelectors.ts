import { createSelector } from "@reduxjs/toolkit"
import { EyeColor } from "optolith-database-schema/types/EyeColor"
import { HairColor } from "optolith-database-schema/types/HairColor"
import { Height, Weight } from "optolith-database-schema/types/Race"
import { SocialStatus } from "optolith-database-schema/types/SocialStatus"
import { isOptionActive } from "../../shared/domain/activatableEntry.ts"
import { DisadvantageIdentifier, EyeColorIdentifier, HairColorIdentifier } from "../../shared/domain/identifier.ts"
import { filterNonNullable, unique } from "../../shared/utils/array.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { compareAt, numAsc } from "../../shared/utils/sort.ts"
import { selectDisadvantages, selectSocialStatusDependencies } from "../slices/characterSlice.ts"
import { selectEyeColors, selectHairColors, selectSocialStatuses } from "../slices/databaseSlice.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
import { selectCurrentRace, selectCurrentRaceVariant } from "./raceSelectors.ts"

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
      .filter(status =>
        status.id >= minimumSocialStatus
        && currentCulture?.social_status.some(ref => ref.id.social_status === status.id))
  }
)

const ALBINO = 1
const GREEN_HAIR = 3

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
    }
    else if (currentRace === undefined) {
      return []
    }
    else {
      return currentRaceVariant?.hair_color?.map(ref => ref.id.hair_color)
        ?? (
          currentRace.variant_dependent.tag === "Plain"
          ? currentRace.variant_dependent.plain.hair_color.map(ref => ref.id.hair_color)
          : []
        )
    }
  }
)

export const selectAvailableHairColors = createSelector(
  selectAvailableHairColorsIdDice,
  selectHairColors,
  (hairColorIds, hairColors): HairColor[] =>
    filterNonNullable(unique(hairColorIds).map(id => hairColors[id]))
)

export const selectAvailableEyeColorsIdDice = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.Stigma),
  (currentRace, currentRaceVariant, stigma): number[] => {
    const isAlbino = isOptionActive(stigma, { type: "Generic", value: ALBINO })

    if (isAlbino) {
      const eyeColorIds = [ EyeColorIdentifier.Red, EyeColorIdentifier.Purple ]
      return eyeColorIds
    }
    else if (currentRace === undefined) {
      return []
    }
    else {
      return currentRaceVariant?.eye_color?.map(ref => ref.id.eye_color)
        ?? (
          currentRace.variant_dependent.tag === "Plain"
          ? currentRace.variant_dependent.plain.eye_color.map(ref => ref.id.eye_color)
          : []
        )
    }
  }
)

export const selectAvailableEyeColors = createSelector(
  selectAvailableEyeColorsIdDice,
  selectEyeColors,
  (eyeColorIds, eyeColors): EyeColor[] =>
    filterNonNullable(unique(eyeColorIds).map(id => eyeColors[id]))
)

export const selectRandomHeightCalculation = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  (currentRace, currentRaceVariant): Height =>
    currentRaceVariant?.height
    ?? (
      currentRace?.variant_dependent.tag === "Plain"
      ? currentRace.variant_dependent.plain.height
      : { base: 0, random: [] }
    )
)

export const selectRandomWeightCalculation = createSelector(
  selectCurrentRace,
  (currentRace): Weight => currentRace?.weight ?? { base: 0, random: [] }
)
