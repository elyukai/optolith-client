import { createSelector } from "@reduxjs/toolkit"
import {
  countActivations,
  isTinyActivatableActive,
} from "../../shared/domain/activatable/activatableEntry.ts"
import {
  DisplayedActiveAdvantage,
  getActiveAdvantages,
} from "../../shared/domain/activatable/advantagesActive.ts"
import {
  DisplayedInactiveAdvantage,
  getInactiveAdvantages,
} from "../../shared/domain/activatable/advantagesInactive.ts"
import { getActiveDisadvantages } from "../../shared/domain/activatable/disadvantagesActive.ts"
import { getInactiveDisadvantages } from "../../shared/domain/activatable/disadvantagesInactive.ts"
import {
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "../../shared/domain/rated/ratedEntry.ts"
import { count, sumWith } from "../../shared/utils/array.ts"
import { selectGetSelectOptionsById } from "./activatableSelectors.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectFilterApplyingActivatableDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage } from "./prerequisiteSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"

/**
 * Returns all all advantages with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveAdvantages = createSelector(
  SelectAll.Static.Advantages,
  SelectGetById.Dynamic.Advantage,
  selectIsEntryAvailable,
  selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage,
  selectGetSelectOptionsById,
  selectFilterApplyingActivatableDependencies,
  createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
    sumWith(dynamicSermons, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
    sumWith(dynamicVisions, countActivations),
  ),
  createSelector(
    SelectAll.Dynamic.Spells,
    SelectAll.Dynamic.Rituals,
    (dynamicSpells, dynamicRituals) =>
      count(dynamicSpells, isRatedWithEnhancementsActive) +
      count(dynamicRituals, isRatedWithEnhancementsActive),
  ),
  SelectGetById.Dynamic.Disadvantage,
  (
    staticAdvantages,
    getDynamicAdvantageById,
    isEntryAvailable,
    prerequisiteCapabilities,
    getSelectOptionsById,
    filterApplyingDependencies,
    activeSermonsCount,
    activeVisionsCount,
    activeSpellworksCount,
    getDynamicDisadvantageById,
  ): DisplayedInactiveAdvantage[] =>
    getInactiveAdvantages(
      staticAdvantages,
      getDynamicAdvantageById,
      isEntryAvailable,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      {
        activeSermonsCount,
        activeVisionsCount,
        activeSpellworksCount,
        getDynamicAdvantageById,
        getDynamicDisadvantageById,
      },
    ),
)

/**
 * Returns all all disadvantages with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveDisadvantages = createSelector(
  SelectAll.Static.Disadvantages,
  SelectGetById.Dynamic.Disadvantage,
  selectIsEntryAvailable,
  selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage,
  selectGetSelectOptionsById,
  selectFilterApplyingActivatableDependencies,
  createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
    sumWith(dynamicSermons, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
    sumWith(dynamicVisions, countActivations),
  ),
  createSelector(
    SelectAll.Dynamic.Spells,
    SelectAll.Dynamic.Rituals,
    (dynamicSpells, dynamicRituals) =>
      count(dynamicSpells, isRatedWithEnhancementsActive) +
      count(dynamicRituals, isRatedWithEnhancementsActive),
  ),
  SelectGetById.Dynamic.Advantage,
  (
    staticDisadvantages,
    getDynamicDisadvantageById,
    isEntryAvailable,
    prerequisiteCapabilities,
    getSelectOptionsById,
    filterApplyingDependencies,
    activeSermonsCount,
    activeVisionsCount,
    activeSpellworksCount,
    getDynamicAdvantageById,
  ): DisplayedInactiveAdvantage[] =>
    getInactiveDisadvantages(
      staticDisadvantages,
      getDynamicDisadvantageById,
      isEntryAvailable,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      {
        activeSermonsCount,
        activeVisionsCount,
        activeSpellworksCount,
        getDynamicAdvantageById,
        getDynamicDisadvantageById,
      },
    ),
)

/**
 * Returns all all advantages with their corresponding dynamic entries,
 * extended by which activation/instance of the entry it represents.
 */
export const selectVisibleActiveAdvantages = createSelector(
  SelectGetById.Static.Advantage,
  SelectAll.Dynamic.Advantages,
  selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage,
  selectGetSelectOptionsById,
  selectFilterApplyingActivatableDependencies,
  createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
    sumWith(dynamicSermons, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
    sumWith(dynamicVisions, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Cantrips, dynamicCantrips =>
    count(dynamicCantrips, isTinyActivatableActive),
  ),
  createSelector(
    SelectAll.Dynamic.Spells,
    SelectAll.Dynamic.Rituals,
    (dynamicSpells, dynamicRituals) =>
      count(dynamicSpells, isRatedWithEnhancementsActive) +
      count(dynamicRituals, isRatedWithEnhancementsActive),
  ),
  createSelector(
    SelectAll.Dynamic.Curses,
    SelectAll.Dynamic.ElvenMagicalSongs,
    SelectAll.Dynamic.DominationRituals,
    SelectAll.Dynamic.MagicalDances,
    SelectAll.Dynamic.MagicalMelodies,
    SelectAll.Dynamic.JesterTricks,
    SelectAll.Dynamic.AnimistPowers,
    SelectAll.Dynamic.GeodeRituals,
    SelectAll.Dynamic.ZibiljaRituals,
    (
      dynamicCurses,
      dynamicElvenMagicalSongs,
      dynamicDominationRituals,
      dynamicMagicalDances,
      dynamicMagicalMelodies,
      dynamicJesterTricks,
      dynamicAnimistPowers,
      dynamicGeodeRituals,
      dynamicZibiljaRituals,
    ) =>
      count(dynamicCurses, isRatedActive) +
      count(dynamicElvenMagicalSongs, isRatedActive) +
      count(dynamicDominationRituals, isRatedActive) +
      count(dynamicMagicalDances, isRatedActive) +
      count(dynamicMagicalMelodies, isRatedActive) +
      count(dynamicJesterTricks, isRatedActive) +
      count(dynamicAnimistPowers, isRatedActive) +
      count(dynamicGeodeRituals, isRatedActive) +
      count(dynamicZibiljaRituals, isRatedActive),
  ),
  createSelector(SelectAll.Dynamic.Blessings, dynamicBlessings =>
    count(dynamicBlessings, isTinyActivatableActive),
  ),
  createSelector(SelectAll.Dynamic.LiturgicalChants, dynamicLiturgicalChants =>
    count(dynamicLiturgicalChants, isRatedWithEnhancementsActive),
  ),
  createSelector(SelectAll.Dynamic.Ceremonies, dynamicCeremonies =>
    count(dynamicCeremonies, isRatedWithEnhancementsActive),
  ),
  SelectGetById.Dynamic.Skill,
  SelectGetById.Dynamic.LiturgicalChant,
  SelectGetById.Dynamic.Ceremony,
  SelectGetById.Dynamic.Spell,
  SelectGetById.Dynamic.Ritual,
  SelectGetById.Dynamic.CloseCombatTechnique,
  SelectGetById.Dynamic.RangedCombatTechnique,
  selectStartExperienceLevel,
  (
    getStaticAdvantageById,
    dynamicAdvantages,
    prerequisiteCapabilities,
    getSelectOptionsById,
    filterApplyingDependencies,
    activeSermonsCount,
    activeVisionsCount,
    activeCantripsCount,
    activeSpellworksCount,
    activeMagicalActionsCount,
    activeBlessingsCount,
    activeLiturgicalChantsCount,
    activeCeremoniesCount,
    getDynamicSkillById,
    getDynamicLiturgicalChantById,
    getDynamicCeremonyById,
    getDynamicSpellById,
    getDynamicRitualById,
    getDynamicCloseCombatTechniqueById,
    getDynamicRangedCombatTechniqueById,
    startExperienceLevel,
  ): DisplayedActiveAdvantage[] =>
    getActiveAdvantages(
      getStaticAdvantageById,
      dynamicAdvantages,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      {
        startExperienceLevel,
        activeSermonsCount,
        activeVisionsCount,
        activeCantripsCount,
        activeSpellworksCount,
        activeMagicalActionsCount,
        activeBlessingsCount,
        activeLiturgicalChantsCount,
        activeCeremoniesCount,
        getDynamicSkillById,
        getDynamicLiturgicalChantById,
        getDynamicCeremonyById,
        getDynamicSpellById,
        getDynamicRitualById,
        getDynamicCloseCombatTechniqueById,
        getDynamicRangedCombatTechniqueById,
      },
    ),
)

/**
 * Returns all all disadvantages with their corresponding dynamic entries,
 * extended by which activation/instance of the entry it represents.
 */
export const selectVisibleActiveDisadvantages = createSelector(
  SelectGetById.Static.Disadvantage,
  SelectAll.Dynamic.Disadvantages,
  selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage,
  selectGetSelectOptionsById,
  selectFilterApplyingActivatableDependencies,
  createSelector(SelectAll.Dynamic.Sermons, dynamicSermons =>
    sumWith(dynamicSermons, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Visions, dynamicVisions =>
    sumWith(dynamicVisions, countActivations),
  ),
  createSelector(SelectAll.Dynamic.Cantrips, dynamicCantrips =>
    count(dynamicCantrips, isTinyActivatableActive),
  ),
  createSelector(
    SelectAll.Dynamic.Spells,
    SelectAll.Dynamic.Rituals,
    (dynamicSpells, dynamicRituals) =>
      count(dynamicSpells, isRatedWithEnhancementsActive) +
      count(dynamicRituals, isRatedWithEnhancementsActive),
  ),
  createSelector(
    SelectAll.Dynamic.Curses,
    SelectAll.Dynamic.ElvenMagicalSongs,
    SelectAll.Dynamic.DominationRituals,
    SelectAll.Dynamic.MagicalDances,
    SelectAll.Dynamic.MagicalMelodies,
    SelectAll.Dynamic.JesterTricks,
    SelectAll.Dynamic.AnimistPowers,
    SelectAll.Dynamic.GeodeRituals,
    SelectAll.Dynamic.ZibiljaRituals,
    (
      dynamicCurses,
      dynamicElvenMagicalSongs,
      dynamicDominationRituals,
      dynamicMagicalDances,
      dynamicMagicalMelodies,
      dynamicJesterTricks,
      dynamicAnimistPowers,
      dynamicGeodeRituals,
      dynamicZibiljaRituals,
    ) =>
      count(dynamicCurses, isRatedActive) +
      count(dynamicElvenMagicalSongs, isRatedActive) +
      count(dynamicDominationRituals, isRatedActive) +
      count(dynamicMagicalDances, isRatedActive) +
      count(dynamicMagicalMelodies, isRatedActive) +
      count(dynamicJesterTricks, isRatedActive) +
      count(dynamicAnimistPowers, isRatedActive) +
      count(dynamicGeodeRituals, isRatedActive) +
      count(dynamicZibiljaRituals, isRatedActive),
  ),
  createSelector(SelectAll.Dynamic.Blessings, dynamicBlessings =>
    count(dynamicBlessings, isTinyActivatableActive),
  ),
  createSelector(SelectAll.Dynamic.LiturgicalChants, dynamicLiturgicalChants =>
    count(dynamicLiturgicalChants, isRatedWithEnhancementsActive),
  ),
  createSelector(SelectAll.Dynamic.Ceremonies, dynamicCeremonies =>
    count(dynamicCeremonies, isRatedWithEnhancementsActive),
  ),
  SelectGetById.Dynamic.Skill,
  SelectGetById.Dynamic.LiturgicalChant,
  SelectGetById.Dynamic.Ceremony,
  SelectGetById.Dynamic.Spell,
  SelectGetById.Dynamic.Ritual,
  SelectGetById.Dynamic.CloseCombatTechnique,
  SelectGetById.Dynamic.RangedCombatTechnique,
  selectStartExperienceLevel,
  (
    getStaticDisadvantageById,
    dynamicDisadvantages,
    prerequisiteCapabilities,
    getSelectOptionsById,
    filterApplyingDependencies,
    activeSermonsCount,
    activeVisionsCount,
    activeCantripsCount,
    activeSpellworksCount,
    activeMagicalActionsCount,
    activeBlessingsCount,
    activeLiturgicalChantsCount,
    activeCeremoniesCount,
    getDynamicSkillById,
    getDynamicLiturgicalChantById,
    getDynamicCeremonyById,
    getDynamicSpellById,
    getDynamicRitualById,
    getDynamicCloseCombatTechniqueById,
    getDynamicRangedCombatTechniqueById,
    startExperienceLevel,
  ): DisplayedActiveAdvantage[] =>
    getActiveDisadvantages(
      getStaticDisadvantageById,
      dynamicDisadvantages,
      prerequisiteCapabilities,
      getSelectOptionsById,
      filterApplyingDependencies,
      {
        startExperienceLevel,
        activeSermonsCount,
        activeVisionsCount,
        activeCantripsCount,
        activeSpellworksCount,
        activeMagicalActionsCount,
        activeBlessingsCount,
        activeLiturgicalChantsCount,
        activeCeremoniesCount,
        getDynamicSkillById,
        getDynamicLiturgicalChantById,
        getDynamicCeremonyById,
        getDynamicSpellById,
        getDynamicRitualById,
        getDynamicCloseCombatTechniqueById,
        getDynamicRangedCombatTechniqueById,
      },
    ),
)

// export const getAdvantagesRating = createMaybeSelector (
//   getRace,
//   getCulture,
//   getProfession,
//   (mrace, mculture, mprofession) =>
//     liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
//              pipe_ (
//                OrderedMap.empty as RatingMap,

//                flip (foldr (insertRating (EntryRating.Common)))
//                     (Race.A.commonAdvantages (r)),

//                flip (foldr (insertRating (EntryRating.Uncommon)))
//                     (Race.A.uncommonAdvantages (r)),

//                flip (foldr (insertRating (EntryRating.Common)))
//                     (Culture.A.commonAdvantages (c)),

//                flip (foldr (insertRating (EntryRating.Uncommon)))
//                     (Culture.A.uncommonAdvantages (c)),

//                flip (foldr (insertRating (EntryRating.Common)))
//                     (Profession.A.suggestedAdvantages (p)),

//                flip (foldr (insertRating (EntryRating.Uncommon)))
//                     (Profession.A.unsuitableAdvantages (p)),

//                flip (foldr (insertRating (EntryRating.Essential)))
//                     (Race.A.stronglyRecommendedAdvantages (r))
//              ))
//            (mrace)
//            (mculture)
//            (mprofession)
// )

// export const getAdvantagesForSheet = createMaybeSelector (
//   getActiveForView (Category.ADVANTAGES),
//   ident
// )

// export const getAdvantagesForEditMap = getActiveForViewMap (Category.ADVANTAGES)

// export const getAdvantagesForEdit = mapCurrentHero (getAdvantagesForEditMap)
