import { createSelector } from "@reduxjs/toolkit"
import { ImprovementCost, adventurePointsForRange } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { selectAttributes, selectCurrentCharacter, selectDerivedCharacteristics, selectTotalAdventurePoints } from "../slices/characterSlice.ts"

export type SpentAdventurePoints = {
  general: number
  bound: number
}

export const selectAdventurePointsSpentOnAttributes = createSelector(
  selectAttributes,
  (attributes): SpentAdventurePoints => Object.values(attributes).reduce(
    (acc, attribute) => ({
      general: acc.general + attribute.cachedAdventurePoints.general,
      bound: acc.bound + attribute.cachedAdventurePoints.bound,
    }),
    { general: 0, bound: 0 }
  )
)

export const selectAdventurePointsSpentOnSkills = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnCombatTechniques = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnSpells = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnLiturgicalChants = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnCantrips = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnBlessings = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnMagicalAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnBlessedAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnMagicalDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

export const selectAdventurePointsSpentOnBlessedDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
)

// export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector(
//   getCurrentHeroPresent,
//   fmap(getDisAdvantagesSubtypeMax(true))
// )

export const selectAdventurePointsSpentOnSpecialAbilities = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 })
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
      0
    )
    + derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack * 2
    + derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack * 2
)

export const selectAdventurePointsSpentOnRace = createSelector(
  selectCurrentCharacter,
  (): number => 0
)

export const selectAdventurePointsSpentOnProfession = createSelector(
  selectCurrentCharacter,
  (): number | undefined => undefined
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
  (...spentCategories): SpentAdventurePoints => spentCategories.reduce<SpentAdventurePoints>(
    (acc, spentCategory) => ({
      general:
        acc.general
        + (
          typeof spentCategory === "number"
          ? spentCategory
          : typeof spentCategory === "object"
          ? spentCategory.general
          : 0),
      bound:
        acc.general
        + (
          typeof spentCategory === "number"
          ? 0
          : typeof spentCategory === "object"
          ? spentCategory.bound
          : 0),
    }),
    { general: 0, bound: 0 }
  )
)

export const selectAdventurePointsAvailable = createSelector(
  selectTotalAdventurePoints,
  selectAdventurePointsSpent,
  (totalAdventurePoints = 0, { general: spentAdventurePoints }) =>
    totalAdventurePoints - spentAdventurePoints
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