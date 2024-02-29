import { createSelector } from "@reduxjs/toolkit"
import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { isActive } from "../../shared/domain/activatable/activatableEntry.ts"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
  RangedCombatTechniqueIdentifier,
} from "../../shared/domain/identifier.ts"
import { getHighestAttributeValue } from "../../shared/domain/rated/attribute.ts"
import {
  createEmptyDynamicCombatTechnique,
  getAttackBaseForClose,
  getAttackBaseForRanged,
  getParryBaseForClose,
} from "../../shared/domain/rated/combatTechnique.ts"
import {
  getCombatTechniqueMaximum,
  getCombatTechniqueMinimum,
  isCombatTechniqueDecreasable,
  isCombatTechniqueIncreasable,
} from "../../shared/domain/rated/combatTechniqueBounds.ts"
import { Rated } from "../../shared/domain/rated/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectDynamicAdvantages,
  selectDynamicGeneralSpecialAbilities,
} from "../slices/characterSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"

/**
 * A combination of a static and corresponding dynamic close combat techniques
 * entry, extended by value bounds, full logic for if the value can be increased
 * or decreased, and combat base values.
 */
export type DisplayedCloseCombatTechnique = {
  kind: "close"
  static: CloseCombatTechnique
  dynamic: Rated
  minimum: number
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  attackBase: number
  parryBase?: number
}

/**
 * A combination of a static and corresponding dynamic ranged combat techniques
 * entry, extended by value bounds, full logic for if the value can be increased
 * or decreased, and the attack base value.
 */
export type DisplayedRangedCombatTechnique = {
  kind: "ranged"
  static: RangedCombatTechnique
  dynamic: Rated
  minimum: number
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  attackBase: number
}

/**
 * A union of all displayed combat technique kinds.
 */
export type DisplayedCombatTechnique =
  | DisplayedCloseCombatTechnique
  | DisplayedRangedCombatTechnique

const selectRangedCombatTechniquesAt10 = createSelector(
  SelectAll.Dynamic.RangedCombatTechniques,
  staticRangedCombatTechniques =>
    staticRangedCombatTechniques.filter(rangedCombatTechnique => rangedCombatTechnique.value >= 10)
      .length,
)

/**
 * Returns all close combat techniques with their corresponding dynamic entries,
 * extended by value bounds, full logic for if the value can be increased or
 * decreased, and combat base values.
 */
export const selectVisibleCloseCombatTechniques = createSelector(
  SelectAll.Static.CloseCombatTechniques,
  SelectGetById.Dynamic.CloseCombatTechnique,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(
    selectDynamicGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.Hunter,
  ),
  SelectGetById.Dynamic.Attribute,
  selectRangedCombatTechniquesAt10,
  selectIsEntryAvailable,
  selectFilterApplyingRatedDependencies,
  (
    staticCloseCombatTechniques,
    getDynamicCloseCombatTechniqueById,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    hunter,
    getDynamicAttributeById,
    rangedCombatTechniquesAt10,
    isEntryAvailable,
    filterApplyingDependencies,
  ): DisplayedCloseCombatTechnique[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return staticCloseCombatTechniques
      .filter(staticLiturgicalChant => isEntryAvailable(staticLiturgicalChant.src))
      .map(combatTechnique => {
        const dynamicCloseCombatTechnique =
          getDynamicCloseCombatTechniqueById(combatTechnique.id) ??
          createEmptyDynamicCombatTechnique(combatTechnique.id)

        const minimum = getCombatTechniqueMinimum(
          rangedCombatTechniquesAt10,
          { tag: "CloseCombatTechnique", closeCombatTechnique: combatTechnique },
          dynamicCloseCombatTechnique,
          hunter,
          filterApplyingDependencies,
        )

        const maximum = getCombatTechniqueMaximum(
          refs => getHighestAttributeValue(getDynamicAttributeById, refs),
          { tag: "CloseCombatTechnique", closeCombatTechnique: combatTechnique },
          isInCharacterCreation,
          startExperienceLevel,
          exceptionalSkill,
        )

        return {
          kind: "close",
          static: combatTechnique,
          dynamic: dynamicCloseCombatTechnique,
          minimum,
          maximum,
          isDecreasable: isCombatTechniqueDecreasable(
            dynamicCloseCombatTechnique,
            minimum,
            canRemove,
          ),
          isIncreasable: isCombatTechniqueIncreasable(dynamicCloseCombatTechnique, maximum),
          attackBase: getAttackBaseForClose(getDynamicAttributeById, dynamicCloseCombatTechnique),
          parryBase: getParryBaseForClose(
            getDynamicAttributeById,
            combatTechnique,
            dynamicCloseCombatTechnique,
          ),
        }
      })
  },
)

/**
 * Returns all ranged combat techniques with their corresponding dynamic
 * entries, extended by value bounds, full logic for if the value can be
 * increased or decreased, and combat base values.
 */
export const selectVisibleRangedCombatTechniques = createSelector(
  SelectAll.Static.RangedCombatTechniques,
  SelectGetById.Dynamic.RangedCombatTechnique,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(
    selectDynamicGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.Hunter,
  ),
  createPropertySelector(
    selectDynamicGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.FireEater,
  ),
  SelectGetById.Dynamic.Attribute,
  selectRangedCombatTechniquesAt10,
  selectIsEntryAvailable,
  selectFilterApplyingRatedDependencies,
  (
    staticRangedCombatTechniques,
    getDynamicRangedCombatTechniqueById,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    hunter,
    fireEater,
    getDynamicAttributeById,
    rangedCombatTechniquesAt10,
    isEntryAvailable,
    filterApplyingDependencies,
  ): DisplayedRangedCombatTechnique[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    const isFireEaterActive = isActive(fireEater)

    return staticRangedCombatTechniques
      .filter(staticLiturgicalChant => isEntryAvailable(staticLiturgicalChant.src))
      .map(combatTechnique => {
        if (
          combatTechnique.id === RangedCombatTechniqueIdentifier.SpittingFire &&
          !isFireEaterActive
        ) {
          return undefined
        }

        const dynamicRangedCombatTechnique =
          getDynamicRangedCombatTechniqueById(combatTechnique.id) ??
          createEmptyDynamicCombatTechnique(combatTechnique.id)

        const minimum = getCombatTechniqueMinimum(
          rangedCombatTechniquesAt10,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: combatTechnique },
          dynamicRangedCombatTechnique,
          hunter,
          filterApplyingDependencies,
        )

        const maximum = getCombatTechniqueMaximum(
          refs => getHighestAttributeValue(getDynamicAttributeById, refs),
          { tag: "RangedCombatTechnique", rangedCombatTechnique: combatTechnique },
          isInCharacterCreation,
          startExperienceLevel,
          exceptionalSkill,
        )

        return {
          kind: "ranged" as const,
          static: combatTechnique,
          dynamic: dynamicRangedCombatTechnique,
          minimum,
          maximum,
          isDecreasable: isCombatTechniqueDecreasable(
            dynamicRangedCombatTechnique,
            minimum,
            canRemove,
          ),
          isIncreasable: isCombatTechniqueIncreasable(dynamicRangedCombatTechnique, maximum),
          attackBase: getAttackBaseForRanged(
            getDynamicAttributeById,
            combatTechnique,
            dynamicRangedCombatTechnique,
          ),
        }
      })
      .filter(isNotNullish)
  },
)

/**
 * Returns all combat techniques with their corresponding dynamic entries,
 * extended by value bounds, full logic for if the value can be increased or
 * decreased, and combat base values.
 */
export const selectVisibleCombatTechniques = createSelector(
  selectVisibleCloseCombatTechniques,
  selectVisibleRangedCombatTechniques,
  (closeCombatTechniques, rangedCombatTechniques): DisplayedCombatTechnique[] => [
    ...closeCombatTechniques,
    ...rangedCombatTechniques,
  ],
)

// export const getCombatTechniquesForSheet = createMaybeSelector(
//   getWiki,
//   getCombatTechniquesForView,
//   (staticData, combatTechniques) =>
//     fmapF(combatTechniques)(
//       filter(
//         x =>
//           SDA.value(CTWAPBA.stateEntry(x)) > 6 ||
//           isEntryFromCoreBook(CTA.src)(StaticData.A.books(staticData))(CTWAPBA.wikiEntry(x)),
//       ),
//     ),
// )

// const getGr = pipe(CTWAPBA.wikiEntry, CTA.gr)
// const getValue = pipe(CTWAPBA.stateEntry, SDA.value)
// type CTWAPB = CombatTechniqueWithAttackParryBase

// export const getAllCombatTechniques = createMaybeSelector(
//   getCombatTechniquesForView,
//   getCurrentHeroPresent,
//   getWiki,
//   (mcombat_techniques, mhero, wiki) =>
//     liftM2((combatTechniques: List<Record<CTWAPB>>) => (hero: HeroModelRecord) => {
//       const hunter = lookup<string>(SpecialAbilityId.Hunter)(HeroModel.A.specialAbilities(hero))

//       const hunterRequiresMinimum =
//         isMaybeActive(hunter) &&
//         thrush(combatTechniques)(List.any(x => getGr(x) === 2 && getValue(x) >= 10))

//       return thrush(combatTechniques)(
//         map(x =>
//           CombatTechniqueWithRequirements({
//             at: CTWAPBA.at(x),
//             pa: CTWAPBA.pa(x),
//             isDecreasable: !isDecreaseDisabled(wiki)(hero)(CTWAPBA.wikiEntry(x))(
//               CTWAPBA.stateEntry(x),
//             )(hunterRequiresMinimum),
//             isIncreasable: !isIncreaseDisabled(wiki)(hero)(CTWAPBA.wikiEntry(x))(
//               CTWAPBA.stateEntry(x),
//             ),
//             stateEntry: CTWAPBA.stateEntry(x),
//             wikiEntry: CTWAPBA.wikiEntry(x),
//           }),
//         ),
//       )
//     })(mcombat_techniques)(mhero),
// )

// export const getAvailableCombatTechniques = createMaybeSelector(
//   getRuleBooksEnabled,
//   getAllCombatTechniques,
//   uncurryN(av =>
//     fmap(
//       filterByAvailabilityAndPred(pipe(CTWRA.wikiEntry, CTA.src))(
//         pipe(CTWRA.stateEntry, SDA.value, gt(6)),
//       )(av),
//     ),
//   ),
// )

// export const getFilteredCombatTechniques = createMaybeSelector(
//   getAvailableCombatTechniques,
//   getCombatTechniquesWithRequirementsSortOptions,
//   getCombatTechniquesFilterText,
//   (mcombat_techniques, sortOptions, filterText) =>
//     fmapF(mcombat_techniques)(
//       filterAndSortRecordsBy(0)([pipe(CTWRA.wikiEntry, CTA.name)])(sortOptions)(filterText),
//     ),
// )
