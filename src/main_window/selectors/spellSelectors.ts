import { createSelector } from "@reduxjs/toolkit"
import { getOptions } from "../../shared/domain/activatable/activatableEntry.ts"
import {
  AdvantageIdentifier,
  MagicalSpecialAbilityIdentifier,
  createIdentifierObject,
} from "../../shared/domain/identifier.ts"
import {
  countActiveSpellworks,
  countActiveSpellworksByImprovementCost,
  countActiveUnfamiliarSpellworks,
  createGetIsUnfamiliar,
  getSpellworksAbove10ByProperty,
  isMaximumOfSpellworksReached,
  isMaximumOfUnfamiliarSpellworksReached,
} from "../../shared/domain/rated/spell.ts"
import {
  DisplayedActiveAnimistPower,
  DisplayedActiveCurse,
  DisplayedActiveDominationRitual,
  DisplayedActiveElvenMagicalSong,
  DisplayedActiveGeodeRitual,
  DisplayedActiveJesterTrick,
  DisplayedActiveMagicalDance,
  DisplayedActiveMagicalMelody,
  DisplayedActiveRitual,
  DisplayedActiveSpell,
  DisplayedActiveSpellwork,
  DisplayedActiveZibiljaRitual,
  getActiveMagicalActions,
  getActiveSpellsOrRituals,
  getVisibleActiveCantrips,
} from "../../shared/domain/rated/spellActive.ts"
import {
  DisplayedInactiveRitual,
  DisplayedInactiveSpell,
  DisplayedInactiveSpellwork,
  getInactiveAnimistPowers,
  getInactiveCurses,
  getInactiveDominationRituals,
  getInactiveElvenMagicalSongs,
  getInactiveGeodeRituals,
  getInactiveJesterTricks,
  getInactiveMagicalDances,
  getInactiveMagicalMelodies,
  getInactiveSpellsOrRituals,
  getInactiveZibiljaRituals,
  getVisibleInactiveCantrips,
} from "../../shared/domain/rated/spellInactive.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import {
  selectDynamicAdvantages,
  selectDynamicAnimistPowers,
  selectDynamicAttributes,
  selectDynamicCantrips,
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicCurses,
  selectDynamicDominationRituals,
  selectDynamicElvenMagicalSongs,
  selectDynamicFocusRules,
  selectDynamicGeodeRituals,
  selectDynamicJesterTricks,
  selectDynamicLiturgicalChants,
  selectDynamicMagicalDances,
  selectDynamicMagicalMelodies,
  selectDynamicMagicalSpecialAbilities,
  selectDynamicOptionalRules,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicSkills,
  selectDynamicSpells,
  selectDynamicZibiljaRituals,
} from "../slices/characterSlice.ts"
import {
  selectStaticAnimistPowers,
  selectStaticCantrips,
  selectStaticCurses,
  selectStaticDominationRituals,
  selectStaticElvenMagicalSongs,
  selectStaticGeodeRituals,
  selectStaticJesterTricks,
  selectStaticMagicalDances,
  selectStaticMagicalMelodies,
  selectStaticRituals,
  selectStaticSpells,
  selectStaticZibiljaRituals,
} from "../slices/databaseSlice.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"
import { selectActiveMagicalTraditions } from "./traditionSelectors.ts"

const selectSpellworksAbove10ByProperty = createSelector(
  selectStaticSpells,
  selectStaticRituals,
  selectStaticCurses,
  selectStaticElvenMagicalSongs,
  selectStaticDominationRituals,
  selectStaticMagicalDances,
  selectStaticMagicalMelodies,
  selectStaticJesterTricks,
  selectStaticAnimistPowers,
  selectStaticGeodeRituals,
  selectStaticZibiljaRituals,
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
  (
    staticSpells,
    staticRituals,
    staticCurses,
    staticElvenMagicalSongs,
    staticDominationRituals,
    staticMagicalDances,
    staticMagicalMelodies,
    staticJesterTricks,
    staticAnimistPowers,
    staticGeodeRituals,
    staticZibiljaRituals,
    dynamicSpells,
    dynamicRituals,
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
    getSpellworksAbove10ByProperty(
      id =>
        (() => {
          switch (id.tag) {
            case "Spell":
              return staticSpells[id.spell]
            case "Ritual":
              return staticRituals[id.ritual]
            case "Curse":
              return staticCurses[id.curse]
            case "ElvenMagicalSong":
              return staticElvenMagicalSongs[id.elven_magical_song]
            case "DominationRitual":
              return staticDominationRituals[id.domination_ritual]
            case "MagicalDance":
              return staticMagicalDances[id.magical_dance]
            case "MagicalMelody":
              return staticMagicalMelodies[id.magical_melody]
            case "JesterTrick":
              return staticJesterTricks[id.jester_trick]
            case "AnimistPower":
              return staticAnimistPowers[id.animist_power]
            case "GeodeRitual":
              return staticGeodeRituals[id.geode_ritual]
            case "ZibiljaRitual":
              return staticZibiljaRituals[id.zibilja_ritual]
            default:
              return assertExhaustive(id)
          }
        })()?.property.id.property,
      dynamicSpells,
      dynamicRituals,
      dynamicCurses,
      dynamicElvenMagicalSongs,
      dynamicDominationRituals,
      dynamicMagicalDances,
      dynamicMagicalMelodies,
      dynamicJesterTricks,
      dynamicAnimistPowers,
      dynamicGeodeRituals,
      dynamicZibiljaRituals,
    ),
)

const selectActivePropertyKnowledges = createSelector(
  createPropertySelector(
    selectDynamicMagicalSpecialAbilities,
    MagicalSpecialAbilityIdentifier.PropertyKnowledge,
  ),
  propertyKnowledge =>
    getOptions(propertyKnowledge).flatMap(option =>
      option.type === "Predefined" && option.id.type === "Property" ? [option.id.value] : [],
    ),
)

const selectGetIsUnfamiliar = createSelector(
  selectActiveMagicalTraditions,
  selectStaticCantrips,
  selectStaticSpells,
  selectStaticRituals,
  createGetIsUnfamiliar,
)

/**
 * Number of active spells and rituals
 */
const selectActiveSpellworksCount = createSelector(
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
  countActiveSpellworks,
)

/**
 * Number of active spells and rituals
 */
const selectActiveUnfamiliarSpellworksCount = createSelector(
  selectDynamicSpells,
  selectDynamicRituals,
  selectGetIsUnfamiliar,
  countActiveUnfamiliarSpellworks,
)

/**
 * Number of active spells and rituals
 */
const selectActiveSpellworksCountByImprovementCost = createSelector(
  selectStaticSpells,
  selectStaticRituals,
  selectStaticCurses,
  selectStaticElvenMagicalSongs,
  selectStaticDominationRituals,
  selectStaticMagicalDances,
  selectStaticMagicalMelodies,
  selectStaticJesterTricks,
  selectStaticAnimistPowers,
  selectStaticGeodeRituals,
  selectStaticZibiljaRituals,
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
  countActiveSpellworksByImprovementCost,
)

const selectIsMaximumOfSpellworksReached = createSelector(
  selectActiveSpellworksCount,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  (activeCount, isInCharacterCreation, startExperienceLevel) =>
    startExperienceLevel === undefined ||
    isMaximumOfSpellworksReached(activeCount, isInCharacterCreation, startExperienceLevel),
)

const selectIsMaximumOfUnfamiliarSpellworksReached = createSelector(
  selectActiveUnfamiliarSpellworksCount,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  (activeUnfamiliarCount, isInCharacterCreation, startExperienceLevel) =>
    startExperienceLevel === undefined ||
    isMaximumOfUnfamiliarSpellworksReached(
      activeUnfamiliarCount,
      isInCharacterCreation,
      startExperienceLevel,
    ),
)

/**
 * Returns the active cantrips for combination with other types.
 */
export const selectVisibleActiveCantrips = createSelector(
  selectStaticCantrips,
  selectDynamicCantrips,
  selectGetIsUnfamiliar,
  (staticCantrips, dynamicCantrips, getIsUnfamiliar) =>
    getVisibleActiveCantrips(staticCantrips, dynamicCantrips, id =>
      getIsUnfamiliar(createIdentifierObject("Cantrip", id)),
    ),
)

/**
 * Returns all spells with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveSpells = createSelector(
  selectStaticSpells,
  selectDynamicSpells,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  selectGetIsUnfamiliar,
  (
    staticSpells,
    dynamicSpells,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
    getIsUnfamiliar,
  ): DisplayedActiveSpell[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveSpellsOrRituals(
      "spell",
      staticSpells,
      dynamicSpells,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
      id => getIsUnfamiliar(createIdentifierObject("Spell", id)),
    )
  },
)

/**
 * Returns all rituals with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveRituals = createSelector(
  selectStaticRituals,
  selectDynamicRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  selectGetIsUnfamiliar,
  (
    staticRituals,
    dynamicRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
    getIsUnfamiliar,
  ): DisplayedActiveRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveSpellsOrRituals(
      "ritual",
      staticRituals,
      dynamicRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
      id => getIsUnfamiliar(createIdentifierObject("Ritual", id)),
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveCurses = createSelector(
  selectStaticCurses,
  selectDynamicCurses,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticCurses,
    dynamicCurses,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveCurse[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "curse",
      staticCurses,
      dynamicCurses,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveElvenMagicalSongs = createSelector(
  selectStaticElvenMagicalSongs,
  selectDynamicElvenMagicalSongs,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticElvenMagicalSongs,
    dynamicElvenMagicalSongs,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveElvenMagicalSong[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "elvenMagicalSong",
      staticElvenMagicalSongs,
      dynamicElvenMagicalSongs,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveDominationRituals = createSelector(
  selectStaticDominationRituals,
  selectDynamicDominationRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticDominationRituals,
    dynamicDominationRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveDominationRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "dominationRitual",
      staticDominationRituals,
      dynamicDominationRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveMagicalDances = createSelector(
  selectStaticMagicalDances,
  selectDynamicMagicalDances,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticMagicalDances,
    dynamicMagicalDances,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveMagicalDance[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "magicalDance",
      staticMagicalDances,
      dynamicMagicalDances,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveMagicalMelodies = createSelector(
  selectStaticMagicalMelodies,
  selectDynamicMagicalMelodies,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticMagicalMelodies,
    dynamicMagicalMelodies,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveMagicalMelody[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "magicalMelody",
      staticMagicalMelodies,
      dynamicMagicalMelodies,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveJesterTricks = createSelector(
  selectStaticJesterTricks,
  selectDynamicJesterTricks,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticJesterTricks,
    dynamicJesterTricks,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveJesterTrick[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "jesterTrick",
      staticJesterTricks,
      dynamicJesterTricks,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveAnimistPowers = createSelector(
  selectStaticAnimistPowers,
  selectDynamicAnimistPowers,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticAnimistPowers,
    dynamicAnimistPowers,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveAnimistPower[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "animistPower",
      staticAnimistPowers,
      dynamicAnimistPowers,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveGeodeRituals = createSelector(
  selectStaticGeodeRituals,
  selectDynamicGeodeRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticGeodeRituals,
    dynamicGeodeRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveGeodeRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "geodeRitual",
      staticGeodeRituals,
      dynamicGeodeRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveZibiljaRituals = createSelector(
  selectStaticZibiljaRituals,
  selectDynamicZibiljaRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  selectDynamicAttributes,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    staticZibiljaRituals,
    dynamicZibiljaRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    attributes,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveZibiljaRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "zibiljaRitual",
      staticZibiljaRituals,
      dynamicZibiljaRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      id => attributes[id],
      filterApplyingDependencies,
      spellworksAbove10ByProperty,
      activePropertyKnowledges,
    )
  },
)

/**
 * Returns all spellworks with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveSpellworks = createSelector(
  selectVisibleActiveCantrips,
  selectVisibleActiveSpells,
  selectVisibleActiveRituals,
  selectVisibleActiveCurses,
  selectVisibleActiveElvenMagicalSongs,
  selectVisibleActiveDominationRituals,
  selectVisibleActiveMagicalDances,
  selectVisibleActiveMagicalMelodies,
  selectVisibleActiveJesterTricks,
  selectVisibleActiveAnimistPowers,
  selectVisibleActiveGeodeRituals,
  selectVisibleActiveZibiljaRituals,
  (
    cantrips,
    spells,
    rituals,
    curses,
    elvenMagicalSongs,
    dominationRituals,
    magicalDances,
    magicalMelodies,
    jesterTricks,
    animistPowers,
    geodeRituals,
    zibiljaRituals,
  ): DisplayedActiveSpellwork[] => [
    ...cantrips,
    ...spells,
    ...rituals,
    ...curses,
    ...elvenMagicalSongs,
    ...dominationRituals,
    ...magicalDances,
    ...magicalMelodies,
    ...jesterTricks,
    ...animistPowers,
    ...geodeRituals,
    ...zibiljaRituals,
  ],
)

/**
 * Returns the inactive cantrips for combination with other types.
 */
export const selectVisibleInactiveCantrips = createSelector(
  selectStaticCantrips,
  selectDynamicCantrips,
  selectActiveMagicalTraditions,
  selectIsEntryAvailable,
  selectGetIsUnfamiliar,
  (staticCantrips, dynamicCantrips, activeTraditions, getIsEntryAvailable, getIsUnfamiliar) =>
    getVisibleInactiveCantrips(
      staticCantrips,
      dynamicCantrips,
      activeTraditions,
      getIsEntryAvailable,
      id => getIsUnfamiliar(createIdentifierObject("Cantrip", id)),
    ),
)

/**
 * Returns all spells with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveSpells = createSelector(
  selectStaticSpells,
  selectDynamicSpells,
  selectActiveMagicalTraditions,
  selectActiveSpellworksCount,
  selectActiveSpellworksCountByImprovementCost,
  selectIsMaximumOfSpellworksReached,
  selectIsMaximumOfUnfamiliarSpellworksReached,
  createPropertySelector(
    selectDynamicMagicalSpecialAbilities,
    MagicalSpecialAbilityIdentifier.Imitationszauberei,
  ),
  selectIsEntryAvailable,
  selectDynamicFocusRules,
  selectDynamicOptionalRules,
  selectDynamicAttributes,
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  selectGetIsUnfamiliar,
  (
    staticSpells,
    dynamicSpells,
    activeMagicalTraditions,
    activeCount,
    activeCountByImprovementCost,
    isMaximumCountReached,
    isMaximumUnfamiliarCountReached,
    imitationszauberei,
    isEntryAvailable,
    dynamicFocusRules,
    dynamicOptionalRules,
    dynamicAttributes,
    dynamicSkills,
    dynamicCloseCombatTechniques,
    dynamicRangedCombatTechniques,
    dynamicRituals,
    dynamicLiturgicalChants,
    dynamicCeremonies,
    getIsUnfamiliar,
  ): DisplayedInactiveSpell[] =>
    getInactiveSpellsOrRituals(
      "spell",
      staticSpells,
      dynamicSpells,
      activeMagicalTraditions,
      activeCount,
      activeCountByImprovementCost,
      isMaximumCountReached,
      isMaximumUnfamiliarCountReached,
      imitationszauberei,
      isEntryAvailable,
      id => dynamicFocusRules[id],
      id => dynamicOptionalRules[id],
      id => dynamicAttributes[id],
      id => dynamicSkills[id],
      id => dynamicCloseCombatTechniques[id],
      id => dynamicRangedCombatTechniques[id],
      id => dynamicSpells[id],
      id => dynamicRituals[id],
      id => dynamicLiturgicalChants[id],
      id => dynamicCeremonies[id],
      id => getIsUnfamiliar(createIdentifierObject("Spell", id)),
    ),
)

/**
 * Returns all rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveRituals = createSelector(
  selectStaticRituals,
  selectDynamicRituals,
  selectActiveMagicalTraditions,
  selectActiveSpellworksCount,
  selectActiveSpellworksCountByImprovementCost,
  selectIsMaximumOfSpellworksReached,
  selectIsMaximumOfUnfamiliarSpellworksReached,
  createPropertySelector(
    selectDynamicMagicalSpecialAbilities,
    MagicalSpecialAbilityIdentifier.Imitationszauberei,
  ),
  selectIsEntryAvailable,
  selectDynamicFocusRules,
  selectDynamicOptionalRules,
  selectDynamicAttributes,
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  selectGetIsUnfamiliar,
  (
    staticRituals,
    dynamicRituals,
    activeMagicalTraditions,
    activeCount,
    activeCountByImprovementCost,
    isMaximumCountReached,
    isMaximumUnfamiliarCountReached,
    imitationszauberei,
    isEntryAvailable,
    dynamicFocusRules,
    dynamicOptionalRules,
    dynamicAttributes,
    dynamicSkills,
    dynamicCloseCombatTechniques,
    dynamicRangedCombatTechniques,
    dynamicSpells,
    dynamicLiturgicalChants,
    dynamicCeremonies,
    getIsUnfamiliar,
  ): DisplayedInactiveRitual[] =>
    getInactiveSpellsOrRituals(
      "ritual",
      staticRituals,
      dynamicRituals,
      activeMagicalTraditions,
      activeCount,
      activeCountByImprovementCost,
      isMaximumCountReached,
      isMaximumUnfamiliarCountReached,
      imitationszauberei,
      isEntryAvailable,
      id => dynamicFocusRules[id],
      id => dynamicOptionalRules[id],
      id => dynamicAttributes[id],
      id => dynamicSkills[id],
      id => dynamicCloseCombatTechniques[id],
      id => dynamicRangedCombatTechniques[id],
      id => dynamicSpells[id],
      id => dynamicRituals[id],
      id => dynamicLiturgicalChants[id],
      id => dynamicCeremonies[id],
      id => getIsUnfamiliar(createIdentifierObject("Ritual", id)),
    ),
)

/**
 * Returns all curses with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveCurses = createSelector(
  selectStaticCurses,
  selectDynamicCurses,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveCurses,
)

/**
 * Returns all elven magical songs with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveElvenMagicalSongs = createSelector(
  selectStaticElvenMagicalSongs,
  selectDynamicElvenMagicalSongs,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveElvenMagicalSongs,
)

/**
 * Returns all domination rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveDominationRituals = createSelector(
  selectStaticDominationRituals,
  selectDynamicDominationRituals,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveDominationRituals,
)

/**
 * Returns all magical dances with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveMagicalDances = createSelector(
  selectStaticMagicalDances,
  selectDynamicMagicalDances,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveMagicalDances,
)

/**
 * Returns all magical melodies with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveMagicalMelodies = createSelector(
  selectStaticMagicalMelodies,
  selectDynamicMagicalMelodies,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveMagicalMelodies,
)

/**
 * Returns all jester tricks with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveJesterTricks = createSelector(
  selectStaticJesterTricks,
  selectDynamicJesterTricks,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveJesterTricks,
)

/**
 * Returns all animist powers with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveAnimistPowers = createSelector(
  selectStaticAnimistPowers,
  selectDynamicAnimistPowers,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveAnimistPowers,
)

/**
 * Returns all geode rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveGeodeRituals = createSelector(
  selectStaticGeodeRituals,
  selectDynamicGeodeRituals,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveGeodeRituals,
)

/**
 * Returns all zibilja rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveZibiljaRituals = createSelector(
  selectStaticZibiljaRituals,
  selectDynamicZibiljaRituals,
  selectActiveMagicalTraditions,
  selectIsMaximumOfSpellworksReached,
  selectIsEntryAvailable,
  getInactiveZibiljaRituals,
)

/**
 * Returns all spellworks with their corresponding dynamic entries, extended by
 * whether the entry can be activated.
 */
export const selectVisibleInactiveSpellworks = createSelector(
  selectVisibleInactiveCantrips,
  selectVisibleInactiveSpells,
  selectVisibleInactiveRituals,
  selectVisibleInactiveCurses,
  selectVisibleInactiveElvenMagicalSongs,
  selectVisibleInactiveDominationRituals,
  selectVisibleInactiveMagicalDances,
  selectVisibleInactiveMagicalMelodies,
  selectVisibleInactiveJesterTricks,
  selectVisibleInactiveAnimistPowers,
  selectVisibleInactiveGeodeRituals,
  selectVisibleInactiveZibiljaRituals,
  (
    cantrips,
    spells,
    rituals,
    curses,
    elvenMagicalSongs,
    dominationRituals,
    magicalDances,
    magicalMelodies,
    jesterTricks,
    animistPowers,
    geodeRituals,
    zibiljaRituals,
  ): DisplayedInactiveSpellwork[] => [
    ...cantrips,
    ...spells,
    ...rituals,
    ...curses,
    ...elvenMagicalSongs,
    ...dominationRituals,
    ...magicalDances,
    ...magicalMelodies,
    ...jesterTricks,
    ...animistPowers,
    ...geodeRituals,
    ...zibiljaRituals,
  ],
)
