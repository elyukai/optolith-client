import { createSelector } from "@reduxjs/toolkit"
import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { isActive } from "../../shared/domain/activatableEntry.ts"
import { getHighestAttributeValue } from "../../shared/domain/attribute.ts"
import {
  getAttackBaseForClose,
  getAttackBaseForRanged,
  getParryBaseForClose,
} from "../../shared/domain/combatTechnique.ts"
import {
  getCombatTechniqueMaximum,
  getCombatTechniqueMinimum,
  isCombatTechniqueDecreasable,
  isCombatTechniqueIncreasable,
} from "../../shared/domain/combatTechniqueBounds.ts"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
  RangedCombatTechniqueIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicCloseCombatTechniques,
  selectDynamicGeneralSpecialAbilities,
  selectDynamicRangedCombatTechniques,
} from "../slices/characterSlice.ts"
import { createInitialDynamicCloseCombatTechnique } from "../slices/closeCombatTechniqueSlice.ts"
import {
  selectStaticCloseCombatTechniques,
  selectStaticRangedCombatTechniques,
} from "../slices/databaseSlice.ts"
import { createInitialDynamicRangedCombatTechnique } from "../slices/rangedCombatTechniqueSlice.ts"
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
  selectDynamicRangedCombatTechniques,
  rangedCombatTechniques =>
    Object.values(rangedCombatTechniques).filter(
      rangedCombatTechnique => rangedCombatTechnique.value >= 10,
    ).length,
)

/**
 * Returns all close combat techniques with their corresponding dynamic entries,
 * extended by value bounds, full logic for if the value can be increased or
 * decreased, and combat base values.
 */
export const selectVisibleCloseCombatTechniques = createSelector(
  selectStaticCloseCombatTechniques,
  selectDynamicCloseCombatTechniques,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(
    selectDynamicGeneralSpecialAbilities,
    GeneralSpecialAbilityIdentifier.Hunter,
  ),
  selectDynamicAttributes,
  selectRangedCombatTechniquesAt10,
  selectIsEntryAvailable,
  selectFilterApplyingRatedDependencies,
  (
    staticCloseCombatTechniques,
    dynamicCloseCombatTechniques,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    hunter,
    attributes,
    rangedCombatTechniquesAt10,
    isEntryAvailable,
    filterApplyingDependencies,
  ): DisplayedCloseCombatTechnique[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return Object.values(staticCloseCombatTechniques)
      .filter(staticLiturgicalChant => isEntryAvailable(staticLiturgicalChant.src))
      .map(combatTechnique => {
        const dynamicCloseCombatTechnique =
          dynamicCloseCombatTechniques[combatTechnique.id] ??
          createInitialDynamicCloseCombatTechnique(combatTechnique.id)

        const minimum = getCombatTechniqueMinimum(
          rangedCombatTechniquesAt10,
          { tag: "CloseCombatTechnique", closeCombatTechnique: combatTechnique },
          dynamicCloseCombatTechnique,
          hunter,
          filterApplyingDependencies,
        )

        const maximum = getCombatTechniqueMaximum(
          refs => getHighestAttributeValue(id => attributes[id], refs),
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
          attackBase: getAttackBaseForClose(id => attributes[id], dynamicCloseCombatTechnique),
          parryBase: getParryBaseForClose(
            id => attributes[id],
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
  selectStaticRangedCombatTechniques,
  selectDynamicRangedCombatTechniques,
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
  selectDynamicAttributes,
  selectRangedCombatTechniquesAt10,
  selectIsEntryAvailable,
  selectFilterApplyingRatedDependencies,
  (
    staticRangedCombatTechniques,
    dynamicRangedCombatTechniques,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    hunter,
    fireEater,
    attributes,
    rangedCombatTechniquesAt10,
    isEntryAvailable,
    filterApplyingDependencies,
  ): DisplayedRangedCombatTechnique[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    const isFireEaterActive = isActive(fireEater)

    return Object.values(staticRangedCombatTechniques)
      .filter(staticLiturgicalChant => isEntryAvailable(staticLiturgicalChant.src))
      .map(combatTechnique => {
        if (
          combatTechnique.id === RangedCombatTechniqueIdentifier.SpittingFire &&
          !isFireEaterActive
        ) {
          return undefined
        }

        const dynamicRangedCombatTechnique =
          dynamicRangedCombatTechniques[combatTechnique.id] ??
          createInitialDynamicRangedCombatTechnique(combatTechnique.id)

        const minimum = getCombatTechniqueMinimum(
          rangedCombatTechniquesAt10,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: combatTechnique },
          dynamicRangedCombatTechnique,
          hunter,
          filterApplyingDependencies,
        )

        const maximum = getCombatTechniqueMaximum(
          refs => getHighestAttributeValue(id => attributes[id], refs),
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
            id => attributes[id],
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
