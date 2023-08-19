import { createSelector } from "@reduxjs/toolkit"
import {
  ImprovementCost,
  adventurePointsForRange,
} from "../../shared/domain/adventurePoints/improvementCost.ts"
import { RatedMap } from "../../shared/domain/ratedEntry.ts"
import {
  selectAttributes,
  selectCloseCombatTechniques,
  selectCurrentCharacter,
  selectDerivedCharacteristics,
  selectRangedCombatTechniques,
  selectSkills,
  selectTotalAdventurePoints,
} from "../slices/characterSlice.ts"

export type SpentAdventurePoints = {
  general: number
  bound: number
}

const sumRatedMaps = (...ratedMaps: RatedMap[]): SpentAdventurePoints =>
  ratedMaps
    .flatMap(ratedMap => Object.values(ratedMap))
    .reduce(
      (acc, rated) => ({
        general: acc.general + rated.cachedAdventurePoints.general,
        bound: acc.bound + rated.cachedAdventurePoints.bound,
      }),
      { general: 0, bound: 0 },
    )

export const selectAdventurePointsSpentOnAttributes = createSelector(selectAttributes, sumRatedMaps)

export const selectAdventurePointsSpentOnSkills = createSelector(selectSkills, sumRatedMaps)

export const selectAdventurePointsSpentOnCombatTechniques = createSelector(
  selectCloseCombatTechniques,
  selectRangedCombatTechniques,
  sumRatedMaps,
)

export const selectAdventurePointsSpentOnSpells = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnLiturgicalChants = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnCantrips = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnBlessings = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnMagicalAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnBlessedAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnMagicalDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnBlessedDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

// export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector(
//   getCurrentHeroPresent,
//   fmap(getDisAdvantagesSubtypeMax(true))
// )

export const selectAdventurePointsSpentOnSpecialAbilities = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

export const selectAdventurePointsSpentOnEnergies = createSelector(
  selectDerivedCharacteristics,
  (derivedCharacteristics): number =>
    [
      derivedCharacteristics.lifePoints.purchased,
      derivedCharacteristics.arcaneEnergy.purchased,
      derivedCharacteristics.karmaPoints.purchased,
    ].reduce(
      (acc, purchased) => acc + adventurePointsForRange(ImprovementCost.D, 0, purchased),
      0,
    ) +
    derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack * 2 +
    derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack * 2,
)

export const selectAdventurePointsSpentOnRace = createSelector(
  selectCurrentCharacter,
  (): number => 0,
)

export const selectAdventurePointsSpentOnProfession = createSelector(
  selectCurrentCharacter,
  (): number | undefined => undefined,
)

export const selectAdventurePointsSpent = createSelector(
  selectAdventurePointsSpentOnAttributes,
  selectAdventurePointsSpentOnSkills,
  selectAdventurePointsSpentOnCombatTechniques,
  selectAdventurePointsSpentOnSpells,
  selectAdventurePointsSpentOnLiturgicalChants,
  selectAdventurePointsSpentOnCantrips,
  selectAdventurePointsSpentOnBlessings,
  selectAdventurePointsSpentOnAdvantages,
  selectAdventurePointsSpentOnMagicalAdvantages,
  selectAdventurePointsSpentOnBlessedAdvantages,
  selectAdventurePointsSpentOnDisadvantages,
  selectAdventurePointsSpentOnMagicalDisadvantages,
  selectAdventurePointsSpentOnBlessedDisadvantages,
  selectAdventurePointsSpentOnSpecialAbilities,
  selectAdventurePointsSpentOnEnergies,
  selectAdventurePointsSpentOnRace,
  selectAdventurePointsSpentOnProfession,
  (...spentCategories): SpentAdventurePoints =>
    spentCategories.reduce<SpentAdventurePoints>(
      (acc, spentCategory) => ({
        general:
          acc.general +
          (typeof spentCategory === "number"
            ? spentCategory
            : typeof spentCategory === "object"
            ? spentCategory.general
            : 0),
        bound:
          acc.general +
          (typeof spentCategory === "number"
            ? 0
            : typeof spentCategory === "object"
            ? spentCategory.bound
            : 0),
      }),
      { general: 0, bound: 0 },
    ),
)

export const selectAdventurePointsAvailable = createSelector(
  selectTotalAdventurePoints,
  selectAdventurePointsSpent,
  (totalAdventurePoints = 0, { general: spentAdventurePoints }) =>
    totalAdventurePoints - spentAdventurePoints,
)

// export const getHasCurrentNoAddedAP = createMaybeSelector (
//   getTotalAdventurePoints,
//   getStartEl,
//   (mtotal_ap, mel) =>
//     elem (true)
//          (liftM2<number, Record<ExperienceLevel>, boolean>
//            (totalAdventurePoints => experienceLevel =>
//              totalAdventurePoints === ExperienceLevel.A.ap (experienceLevel))
//            (mtotal_ap)
//            (mel))
// )
