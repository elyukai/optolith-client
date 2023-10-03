import { createSelector } from "@reduxjs/toolkit"
import {
  ImprovementCost,
  adventurePointsForRange,
} from "../../shared/domain/adventurePoints/improvementCost.ts"
import { RatedAdventurePointsCache } from "../../shared/domain/adventurePoints/ratedEntry.ts"
import {
  selectAnimistPowers,
  selectAttributes,
  selectBlessings,
  selectCantrips,
  selectCeremonies,
  selectCloseCombatTechniques,
  selectCurrentCharacter,
  selectCurses,
  selectDerivedCharacteristics,
  selectDominationRituals,
  selectElvenMagicalSongs,
  selectGeodeRituals,
  selectJesterTricks,
  selectLiturgicalChants,
  selectMagicalDances,
  selectMagicalMelodies,
  selectRangedCombatTechniques,
  selectRituals,
  selectSkills,
  selectSpells,
  selectTotalAdventurePoints,
  selectZibiljaRituals,
} from "../slices/characterSlice.ts"

/**
 * Adventure Points can either be spent from the main pool of adventure points
 * or from the pool bound to a specific entry.
 */
export type SpentAdventurePoints = {
  general: number
  bound: number
}

const sumRatedMaps = (
  ...ratedMaps: Record<number, { cachedAdventurePoints: RatedAdventurePointsCache }>[]
): SpentAdventurePoints =>
  ratedMaps
    .flatMap(ratedMap => Object.values(ratedMap))
    .reduce(
      (acc, rated) => ({
        general: acc.general + rated.cachedAdventurePoints.general,
        bound: acc.bound + rated.cachedAdventurePoints.bound,
      }),
      { general: 0, bound: 0 },
    )

/**
 * Returns the adventure points spent on attributes.
 */
export const selectAdventurePointsSpentOnAttributes = createSelector(selectAttributes, sumRatedMaps)

/**
 * Returns the adventure points spent on skills.
 */
export const selectAdventurePointsSpentOnSkills = createSelector(selectSkills, sumRatedMaps)

/**
 * Returns the adventure points spent on combat techniques.
 */
export const selectAdventurePointsSpentOnCombatTechniques = createSelector(
  selectCloseCombatTechniques,
  selectRangedCombatTechniques,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on spells.
 */
export const selectAdventurePointsSpentOnSpells = createSelector(
  selectSpells,
  selectRituals,
  selectCurses,
  selectElvenMagicalSongs,
  selectDominationRituals,
  selectMagicalDances,
  selectMagicalMelodies,
  selectJesterTricks,
  selectAnimistPowers,
  selectGeodeRituals,
  selectZibiljaRituals,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on liturgical chants.
 */
export const selectAdventurePointsSpentOnLiturgicalChants = createSelector(
  selectLiturgicalChants,
  selectCeremonies,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on cantrips.
 */
export const selectAdventurePointsSpentOnCantrips = createSelector(
  selectCantrips,
  (cantrips): SpentAdventurePoints => ({ general: cantrips.length, bound: 0 }),
)

/**
 * Returns the adventure points spent on blessings.
 */
export const selectAdventurePointsSpentOnBlessings = createSelector(
  selectBlessings,
  (blessings): SpentAdventurePoints => ({ general: blessings.length, bound: 0 }),
)

/**
 * Returns the adventure points spent on advantages.
 */
export const selectAdventurePointsSpentOnAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on magical advantages.
 */
export const selectAdventurePointsSpentOnMagicalAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on blessed advantages.
 */
export const selectAdventurePointsSpentOnBlessedAdvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on disadvantages.
 */
export const selectAdventurePointsSpentOnDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on magical disadvantages.
 */
export const selectAdventurePointsSpentOnMagicalDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on blessed disadvantages.
 */
export const selectAdventurePointsSpentOnBlessedDisadvantages = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on special abilities.
 */
export const selectAdventurePointsSpentOnSpecialAbilities = createSelector(
  selectCurrentCharacter,
  (): SpentAdventurePoints => ({ general: 0, bound: 0 }),
)

/**
 * Returns the adventure points spent on energies.
 */
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

/**
 * Returns the adventure points spent on race.
 */
export const selectAdventurePointsSpentOnRace = createSelector(
  selectCurrentCharacter,
  (): number => 0,
)

/**
 * Returns the adventure points spent on profession.
 */
export const selectAdventurePointsSpentOnProfession = createSelector(
  selectCurrentCharacter,
  (): number | undefined => undefined,
)

/**
 * Returns the adventure points spent.
 */
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

/**
 * Returns the available adventure points.
 */
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
