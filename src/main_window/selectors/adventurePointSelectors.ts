import { createSelector } from "@reduxjs/toolkit"
import {
  TinyActivatable,
  isTinyActivatableActive,
} from "../../shared/domain/activatable/activatableEntry.ts"
import {
  AdventurePointsCache,
  addAdventurePointsCaches,
  emptyAdventurePointsCache,
} from "../../shared/domain/adventurePoints/cache.ts"
import {
  ImprovementCost,
  adventurePointsForRange,
} from "../../shared/domain/adventurePoints/improvementCost.ts"
import { count } from "../../shared/utils/array.ts"
import {
  selectCurrentCharacter,
  selectDerivedCharacteristics,
  selectDynamicAdvantages,
  selectDynamicAnimistPowers,
  selectDynamicAttributes,
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicCurses,
  selectDynamicDisadvantages,
  selectDynamicDominationRituals,
  selectDynamicElvenMagicalSongs,
  selectDynamicGeodeRituals,
  selectDynamicJesterTricks,
  selectDynamicLiturgicalChants,
  selectDynamicMagicalDances,
  selectDynamicMagicalMelodies,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicSkills,
  selectDynamicSpecialAbilities,
  selectDynamicSpells,
  selectDynamicZibiljaRituals,
  selectTotalAdventurePoints,
} from "../slices/characterSlice.ts"
import { selectMagicalAndBlessedAdvantagesAndDisadvantagesCache } from "../slices/databaseSlice.ts"
import { SelectAll } from "./basicCapabilitySelectors.ts"

const sumRatedMaps = (
  ...ratedMaps: (Record<number, { cachedAdventurePoints: AdventurePointsCache }> | undefined)[]
): AdventurePointsCache =>
  ratedMaps
    .flatMap(ratedMap => Object.values(ratedMap ?? {}))
    .reduce(
      (acc, rated) => addAdventurePointsCaches(acc, rated.cachedAdventurePoints),
      emptyAdventurePointsCache,
    )

/**
 * Returns the adventure points spent on attributes.
 */
export const selectAdventurePointsSpentOnAttributes = createSelector(
  selectDynamicAttributes,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on skills.
 */
export const selectAdventurePointsSpentOnSkills = createSelector(selectDynamicSkills, sumRatedMaps)

/**
 * Returns the adventure points spent on combat techniques.
 */
export const selectAdventurePointsSpentOnCombatTechniques = createSelector(
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on spells.
 */
export const selectAdventurePointsSpentOnSpells = createSelector(
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicCurses,
  selectDynamicElvenMagicalSongs,
  selectDynamicDominationRituals,
  selectDynamicMagicalDances,
  selectDynamicMagicalMelodies,
  selectDynamicJesterTricks,
  selectDynamicAnimistPowers,
  selectDynamicGeodeRituals,
  selectDynamicZibiljaRituals,
  sumRatedMaps,
)

/**
 * Returns the adventure points spent on liturgical chants.
 */
export const selectAdventurePointsSpentOnLiturgicalChants = createSelector(
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  sumRatedMaps,
)

const sumTinyActivatables = (tinyActivatables: TinyActivatable[]): AdventurePointsCache => ({
  general: count(tinyActivatables, isTinyActivatableActive),
  bound: 0,
})

/**
 * Returns the adventure points spent on cantrips.
 */
export const selectAdventurePointsSpentOnCantrips = createSelector(
  SelectAll.Dynamic.Cantrips,
  sumTinyActivatables,
)

/**
 * Returns the adventure points spent on blessings.
 */
export const selectAdventurePointsSpentOnBlessings = createSelector(
  SelectAll.Dynamic.Blessings,
  sumTinyActivatables,
)

const sumActivatableMaps = (
  ...activatableMaps: Record<number, { cachedAdventurePoints: AdventurePointsCache }>[]
): AdventurePointsCache =>
  activatableMaps
    .flatMap(activatableMap => Object.values(activatableMap ?? {}))
    .reduce(
      (acc, rated) => addAdventurePointsCaches(acc, rated.cachedAdventurePoints),
      emptyAdventurePointsCache,
    )

const sumActivatables = (
  activatables: { cachedAdventurePoints: AdventurePointsCache }[],
): AdventurePointsCache =>
  activatables.reduce(
    (acc, rated) => addAdventurePointsCaches(acc, rated.cachedAdventurePoints),
    emptyAdventurePointsCache,
  )

/**
 * Returns the adventure points spent on advantages.
 */
export const selectAdventurePointsSpentOnAdvantages = createSelector(
  selectDynamicAdvantages,
  (dynamicAdvantages): AdventurePointsCache => sumActivatableMaps(dynamicAdvantages ?? {}),
)

/**
 * Returns the adventure points spent on magical advantages.
 */
export const selectAdventurePointsSpentOnMagicalAdvantages = createSelector(
  SelectAll.Dynamic.Advantages,
  selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  (dynamicAdvantages, cache): AdventurePointsCache =>
    sumActivatables(
      dynamicAdvantages.filter(({ id }) => cache.advantages.magical.ids.includes(id)),
    ),
)

/**
 * Returns the adventure points spent on blessed advantages.
 */
export const selectAdventurePointsSpentOnBlessedAdvantages = createSelector(
  SelectAll.Dynamic.Advantages,
  selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  (dynamicAdvantages, cache): AdventurePointsCache =>
    sumActivatables(
      dynamicAdvantages.filter(({ id }) => cache.advantages.blessed.ids.includes(id)),
    ),
)

/**
 * Returns the adventure points spent on disadvantages.
 */
export const selectAdventurePointsSpentOnDisadvantages = createSelector(
  selectDynamicDisadvantages,
  (dynamicDisadvantages): AdventurePointsCache => {
    const { general, bound } = sumActivatableMaps(dynamicDisadvantages ?? {})
    return { general: -general, bound: -bound }
  },
)

/**
 * Returns the adventure points spent on magical disadvantages.
 */
export const selectAdventurePointsSpentOnMagicalDisadvantages = createSelector(
  SelectAll.Dynamic.Disadvantages,
  selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  (dynamicDisadvantages, cache): AdventurePointsCache => {
    const { general, bound } = sumActivatables(
      dynamicDisadvantages.filter(({ id }) => cache.disadvantages.magical.ids.includes(id)),
    )
    return { general: -general, bound: -bound }
  },
)

/**
 * Returns the adventure points spent on blessed disadvantages.
 */
export const selectAdventurePointsSpentOnBlessedDisadvantages = createSelector(
  SelectAll.Dynamic.Disadvantages,
  selectMagicalAndBlessedAdvantagesAndDisadvantagesCache,
  (dynamicDisadvantages, cache): AdventurePointsCache => {
    const { general, bound } = sumActivatables(
      dynamicDisadvantages.filter(({ id }) => cache.disadvantages.blessed.ids.includes(id)),
    )
    return { general: -general, bound: -bound }
  },
)

/**
 * Returns the adventure points spent on special abilities.
 */
export const selectAdventurePointsSpentOnSpecialAbilities = createSelector(
  selectDynamicSpecialAbilities,
  (dynamicSpecialAbilities): AdventurePointsCache =>
    sumActivatableMaps(...Object.values(dynamicSpecialAbilities ?? {})),
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
  selectAdventurePointsSpentOnDisadvantages,
  selectAdventurePointsSpentOnSpecialAbilities,
  selectAdventurePointsSpentOnEnergies,
  selectAdventurePointsSpentOnRace,
  selectAdventurePointsSpentOnProfession,
  (...spentCategories): AdventurePointsCache =>
    spentCategories.reduce<AdventurePointsCache>(
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
