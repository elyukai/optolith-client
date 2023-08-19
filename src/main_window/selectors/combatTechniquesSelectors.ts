import { createSelector } from "@reduxjs/toolkit"
import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
// import { CombatTechniqueId, SpecialAbilityId } from "../../App/Constants/Ids.ts"
// import { createSkillDependentWithValue6 } from "../../App/Models/ActiveEntries/SkillDependent.ts"
// import { HeroModel, HeroModelRecord } from "../../App/Models/Hero/HeroModel.ts"
// import {
//   CombatTechniqueWithAttackParryBase,
//   CombatTechniqueWithAttackParryBaseA_,
// } from "../../App/Models/View/CombatTechniqueWithAttackParryBase.ts"
// import { CombatTechniqueWithRequirements } from "../../App/Models/View/CombatTechniqueWithRequirements.ts"
// import { CombatTechnique } from "../../App/Models/Wiki/CombatTechnique.ts"
// import { StaticData } from "../../App/Models/Wiki/WikiModel.ts"
// import { getRuleBooksEnabled } from "../../App/Selectors/rulesSelectors.ts"
// import { getCombatTechniquesWithRequirementsSortOptions } from "../../App/Selectors/sortOptionsSelectors.ts"
// import {
//   getAttributes,
//   getCombatTechniques,
//   getCombatTechniquesFilterText,
//   getCurrentHeroPresent,
//   getSpecialAbilities,
//   getWiki,
//   getWikiCombatTechniques,
// } from "../../App/Selectors/stateSelectors.ts"
// import { isMaybeActive } from "../../App/Utilities/Activatable/isActive.ts"
// import { compareLocale } from "../../App/Utilities/I18n.ts"
// import {
//   isDecreaseDisabled,
//   isIncreaseDisabled,
// } from "../../App/Utilities/Increasable/combatTechniqueUtils.ts"
// import { filterByAvailabilityAndPred, isEntryFromCoreBook } from "../../App/Utilities/RulesUtils.ts"
// import { createMaybeSelector } from "../../App/Utilities/createMaybeSelector.ts"
// import { filterAndSortRecordsBy } from "../../App/Utilities/filterAndSortBy.ts"
// import { pipe, pipe_ } from "../../App/Utilities/pipe.ts"
// import { comparingR, sortByMulti } from "../../App/Utilities/sortBy.ts"
// import { ident, thrush } from "../../Data/Function.ts"
// import { fmap, fmapF } from "../../Data/Functor.ts"
// import { List, consF, filter, fnull, map } from "../../Data/List.ts"
// import { liftM2, maybe } from "../../Data/Maybe.ts"
// import { gt } from "../../Data/Num.ts"
// import { findWithDefault, foldrWithKey, lookup } from "../../Data/OrderedMap.ts"
// import { Record } from "../../Data/Record.ts"
// import { uncurryN } from "../../Data/Tuple/Curry.ts"
import { isActive } from "../../shared/domain/activatableEntry.ts"
import {
  getAttackBaseForClose,
  getAttackBaseForRanged,
  getCombatTechniqueMaximum,
  getCombatTechniqueMinimum,
  getParryBaseForClose,
  isCombatTechniqueDecreasable,
  isCombatTechniqueIncreasable,
} from "../../shared/domain/combatTechnique.ts"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
import {
  AdvantageIdentifier,
  GeneralSpecialAbilityIdentifier,
  RangedCombatTechniqueIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectAdvantages,
  selectAttributes,
  selectCeremonies,
  selectCloseCombatTechniques as selectDynamicCloseCombatTechniques,
  selectRangedCombatTechniques as selectDynamicRangedCombatTechniques,
  selectGeneralSpecialAbilities,
  selectLiturgicalChants,
  selectRituals,
  selectSkills,
  selectSpells,
} from "../slices/characterSlice.ts"
import { createInitialDynamicCloseCombatTechnique } from "../slices/closeCombatTechniqueSlice.ts"
import {
  selectCloseCombatTechniques as selectStaticCloseCombatTechniques,
  selectRangedCombatTechniques as selectStaticRangedCombatTechniques,
} from "../slices/databaseSlice.ts"
import { createInitialDynamicRangedCombatTechnique } from "../slices/rangedCombatTechniqueSlice.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"

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

export type DisplayedCombatTechnique =
  | DisplayedCloseCombatTechnique
  | DisplayedRangedCombatTechnique

export const selectVisibleCloseCombatTechniques = createSelector(
  selectStaticCloseCombatTechniques,
  selectDynamicCloseCombatTechniques,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(selectGeneralSpecialAbilities, GeneralSpecialAbilityIdentifier.Hunter),
  selectAttributes,
  selectSkills,
  selectDynamicRangedCombatTechniques,
  selectSpells,
  selectRituals,
  selectLiturgicalChants,
  selectCeremonies,
  (
    staticCloseCombatTechniques,
    dynamicCloseCombatTechniques,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    hunter,
    attributes,
    skills,
    rangedCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    ceremonies,
  ): DisplayedCloseCombatTechnique[] => {
    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes,
      skills,
      closeCombatTechniques: dynamicCloseCombatTechniques,
      rangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants,
      ceremonies,
    })

    return Object.values(staticCloseCombatTechniques).map(combatTechnique => {
      const dynamicCloseCombatTechnique =
        dynamicCloseCombatTechniques[combatTechnique.id] ??
        createInitialDynamicCloseCombatTechnique(combatTechnique.id)

      const minimum = getCombatTechniqueMinimum(
        rangedCombatTechniques,
        { tag: "CloseCombatTechnique", closeCombatTechnique: combatTechnique },
        dynamicCloseCombatTechnique,
        hunter,
        filterApplyingDependencies,
      )

      const maximum = getCombatTechniqueMaximum(
        attributes,
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
        attackBase: getAttackBaseForClose(attributes, dynamicCloseCombatTechnique),
        parryBase: getParryBaseForClose(attributes, combatTechnique, dynamicCloseCombatTechnique),
      }
    })
  },
)

export const selectVisibleRangedCombatTechniques = createSelector(
  selectStaticRangedCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(selectGeneralSpecialAbilities, GeneralSpecialAbilityIdentifier.Hunter),
  createPropertySelector(selectGeneralSpecialAbilities, GeneralSpecialAbilityIdentifier.FireEater),
  selectAttributes,
  selectSkills,
  selectDynamicCloseCombatTechniques,
  selectSpells,
  selectRituals,
  selectLiturgicalChants,
  selectCeremonies,
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
    skills,
    closeCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    ceremonies,
  ): DisplayedRangedCombatTechnique[] => {
    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes,
      skills,
      closeCombatTechniques,
      rangedCombatTechniques: dynamicRangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants,
      ceremonies,
    })

    const isFireEaterActive = isActive(fireEater)

    return Object.values(staticRangedCombatTechniques)
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
          dynamicRangedCombatTechniques,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: combatTechnique },
          dynamicRangedCombatTechnique,
          hunter,
          filterApplyingDependencies,
        )

        const maximum = getCombatTechniqueMaximum(
          attributes,
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
            attributes,
            combatTechnique,
            dynamicRangedCombatTechnique,
          ),
        }
      })
      .filter(isNotNullish)
  },
)

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
