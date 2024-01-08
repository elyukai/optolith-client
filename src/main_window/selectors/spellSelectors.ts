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
  selectDynamicMagicalSpecialAbilities,
} from "../slices/characterSlice.ts"
import {
  selectStaticCantrips,
  selectStaticRituals,
  selectStaticSpells,
} from "../slices/databaseSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import { selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectCapabilitiesForPrerequisitesOfSpellwork } from "./prerequisiteSelectors.ts"
import { selectIsEntryAvailable } from "./publicationSelectors.ts"
import { selectActiveMagicalTraditions } from "./traditionSelectors.ts"

const selectSpellworksAbove10ByProperty = createSelector(
  SelectGetById.Static.Spell,
  SelectGetById.Static.Ritual,
  SelectGetById.Static.Curse,
  SelectGetById.Static.ElvenMagicalSong,
  SelectGetById.Static.DominationRitual,
  SelectGetById.Static.MagicalDance,
  SelectGetById.Static.MagicalMelody,
  SelectGetById.Static.JesterTrick,
  SelectGetById.Static.AnimistPower,
  SelectGetById.Static.GeodeRitual,
  SelectGetById.Static.ZibiljaRitual,
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
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
    getStaticSpellById,
    getStaticRitualById,
    getStaticCurseById,
    getStaticElvenMagicalSongById,
    getStaticDominationRitualById,
    getStaticMagicalDanceById,
    getStaticMagicalMelodyById,
    getStaticJesterTrickById,
    getStaticAnimistPowerById,
    getStaticGeodeRitualById,
    getStaticZibiljaRitualById,
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
              return getStaticSpellById(id.spell)
            case "Ritual":
              return getStaticRitualById(id.ritual)
            case "Curse":
              return getStaticCurseById(id.curse)
            case "ElvenMagicalSong":
              return getStaticElvenMagicalSongById(id.elven_magical_song)
            case "DominationRitual":
              return getStaticDominationRitualById(id.domination_ritual)
            case "MagicalDance":
              return getStaticMagicalDanceById(id.magical_dance)
            case "MagicalMelody":
              return getStaticMagicalMelodyById(id.magical_melody)
            case "JesterTrick":
              return getStaticJesterTrickById(id.jester_trick)
            case "AnimistPower":
              return getStaticAnimistPowerById(id.animist_power)
            case "GeodeRitual":
              return getStaticGeodeRitualById(id.geode_ritual)
            case "ZibiljaRitual":
              return getStaticZibiljaRitualById(id.zibilja_ritual)
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
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
  SelectAll.Dynamic.Curses,
  SelectAll.Dynamic.ElvenMagicalSongs,
  SelectAll.Dynamic.DominationRituals,
  SelectAll.Dynamic.MagicalDances,
  SelectAll.Dynamic.MagicalMelodies,
  SelectAll.Dynamic.JesterTricks,
  SelectAll.Dynamic.AnimistPowers,
  SelectAll.Dynamic.GeodeRituals,
  SelectAll.Dynamic.ZibiljaRituals,
  countActiveSpellworks,
)

/**
 * Number of active spells and rituals
 */
const selectActiveUnfamiliarSpellworksCount = createSelector(
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
  selectGetIsUnfamiliar,
  countActiveUnfamiliarSpellworks,
)

/**
 * Number of active spells and rituals
 */
const selectActiveSpellworksCountByImprovementCost = createSelector(
  SelectGetById.Static.Spell,
  SelectGetById.Static.Ritual,
  SelectGetById.Static.Curse,
  SelectGetById.Static.ElvenMagicalSong,
  SelectGetById.Static.DominationRitual,
  SelectGetById.Static.MagicalDance,
  SelectGetById.Static.MagicalMelody,
  SelectGetById.Static.JesterTrick,
  SelectGetById.Static.AnimistPower,
  SelectGetById.Static.GeodeRitual,
  SelectGetById.Static.ZibiljaRitual,
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
  SelectAll.Dynamic.Curses,
  SelectAll.Dynamic.ElvenMagicalSongs,
  SelectAll.Dynamic.DominationRituals,
  SelectAll.Dynamic.MagicalDances,
  SelectAll.Dynamic.MagicalMelodies,
  SelectAll.Dynamic.JesterTricks,
  SelectAll.Dynamic.AnimistPowers,
  SelectAll.Dynamic.GeodeRituals,
  SelectAll.Dynamic.ZibiljaRituals,
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
  SelectGetById.Static.Cantrip,
  SelectAll.Dynamic.Cantrips,
  selectGetIsUnfamiliar,
  (getStaticCantripById, dynamicCantrips, getIsUnfamiliar) =>
    getVisibleActiveCantrips(getStaticCantripById, dynamicCantrips, id =>
      getIsUnfamiliar(createIdentifierObject("Cantrip", id)),
    ),
)

/**
 * Returns all spells with their corresponding dynamic entries, extended by
 * value bounds, and full logic for if the value can be increased or decreased.
 */
export const selectVisibleActiveSpells = createSelector(
  SelectGetById.Static.Spell,
  SelectAll.Dynamic.Spells,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  selectGetIsUnfamiliar,
  (
    getStaticSpellById,
    dynamicSpells,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    getDynamicAttributeById,
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
      getStaticSpellById,
      dynamicSpells,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      getDynamicAttributeById,
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
  SelectGetById.Static.Ritual,
  SelectAll.Dynamic.Rituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  selectGetIsUnfamiliar,
  (
    getStaticRitualById,
    dynamicRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    exceptionalSkill,
    getDynamicAttributeById,
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
      getStaticRitualById,
      dynamicRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      exceptionalSkill,
      getDynamicAttributeById,
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
  SelectGetById.Static.Curse,
  SelectAll.Dynamic.Curses,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticCurseById,
    dynamicCurses,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveCurse[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "curse",
      getStaticCurseById,
      dynamicCurses,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.ElvenMagicalSong,
  SelectAll.Dynamic.ElvenMagicalSongs,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticElvenMagicalSongById,
    dynamicElvenMagicalSongs,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveElvenMagicalSong[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "elvenMagicalSong",
      getStaticElvenMagicalSongById,
      dynamicElvenMagicalSongs,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.DominationRitual,
  SelectAll.Dynamic.DominationRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticDominationRitualById,
    dynamicDominationRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveDominationRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "dominationRitual",
      getStaticDominationRitualById,
      dynamicDominationRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.MagicalDance,
  SelectAll.Dynamic.MagicalDances,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticMagicalDanceById,
    dynamicMagicalDances,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveMagicalDance[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "magicalDance",
      getStaticMagicalDanceById,
      dynamicMagicalDances,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.MagicalMelody,
  SelectAll.Dynamic.MagicalMelodies,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticMagicalMelodyById,
    dynamicMagicalMelodies,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveMagicalMelody[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "magicalMelody",
      getStaticMagicalMelodyById,
      dynamicMagicalMelodies,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.JesterTrick,
  SelectAll.Dynamic.JesterTricks,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticJesterTrickById,
    dynamicJesterTricks,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveJesterTrick[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "jesterTrick",
      getStaticJesterTrickById,
      dynamicJesterTricks,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.AnimistPower,
  SelectAll.Dynamic.AnimistPowers,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticAnimistPowerById,
    dynamicAnimistPowers,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveAnimistPower[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "animistPower",
      getStaticAnimistPowerById,
      dynamicAnimistPowers,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.GeodeRitual,
  SelectAll.Dynamic.GeodeRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticGeodeRitualById,
    dynamicGeodeRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveGeodeRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "geodeRitual",
      getStaticGeodeRitualById,
      dynamicGeodeRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectGetById.Static.ZibiljaRitual,
  SelectAll.Dynamic.ZibiljaRituals,
  selectIsInCharacterCreation,
  selectStartExperienceLevel,
  selectCanRemove,
  SelectGetById.Dynamic.Attribute,
  selectFilterApplyingRatedDependencies,
  selectSpellworksAbove10ByProperty,
  selectActivePropertyKnowledges,
  (
    getStaticZibiljaRitualById,
    dynamicZibiljaRituals,
    isInCharacterCreation,
    startExperienceLevel,
    canRemove,
    getDynamicAttributeById,
    filterApplyingDependencies,
    spellworksAbove10ByProperty,
    activePropertyKnowledges,
  ): DisplayedActiveZibiljaRitual[] => {
    if (startExperienceLevel === undefined) {
      return []
    }

    return getActiveMagicalActions(
      "zibiljaRitual",
      getStaticZibiljaRitualById,
      dynamicZibiljaRituals,
      isInCharacterCreation,
      startExperienceLevel,
      canRemove,
      getDynamicAttributeById,
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
  SelectAll.Static.Cantrips,
  SelectGetById.Dynamic.Cantrip,
  selectActiveMagicalTraditions,
  selectIsEntryAvailable,
  selectGetIsUnfamiliar,
  (staticCantrips, getDynamicCantripById, activeTraditions, getIsEntryAvailable, getIsUnfamiliar) =>
    getVisibleInactiveCantrips(
      staticCantrips,
      getDynamicCantripById,
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
  SelectAll.Static.Spells,
  SelectGetById.Dynamic.Spell,
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
  selectCapabilitiesForPrerequisitesOfSpellwork,
  selectGetIsUnfamiliar,
  (
    staticSpells,
    getDynamicSpellById,
    activeMagicalTraditions,
    activeCount,
    activeCountByImprovementCost,
    isMaximumCountReached,
    isMaximumUnfamiliarCountReached,
    imitationszauberei,
    isEntryAvailable,
    prerequisiteCapabilities,
    getIsUnfamiliar,
  ): DisplayedInactiveSpell[] =>
    getInactiveSpellsOrRituals(
      "spell",
      staticSpells,
      getDynamicSpellById,
      activeMagicalTraditions,
      activeCount,
      activeCountByImprovementCost,
      isMaximumCountReached,
      isMaximumUnfamiliarCountReached,
      imitationszauberei,
      isEntryAvailable,
      prerequisiteCapabilities,
      id => getIsUnfamiliar(createIdentifierObject("Spell", id)),
    ),
)

/**
 * Returns all rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveRituals = createSelector(
  SelectAll.Static.Rituals,
  SelectGetById.Dynamic.Ritual,
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
  selectCapabilitiesForPrerequisitesOfSpellwork,
  selectGetIsUnfamiliar,
  (
    staticRituals,
    getDynamicRitualById,
    activeMagicalTraditions,
    activeCount,
    activeCountByImprovementCost,
    isMaximumCountReached,
    isMaximumUnfamiliarCountReached,
    imitationszauberei,
    isEntryAvailable,
    prerequisiteCapabilities,
    getIsUnfamiliar,
  ): DisplayedInactiveRitual[] =>
    getInactiveSpellsOrRituals(
      "ritual",
      staticRituals,
      getDynamicRitualById,
      activeMagicalTraditions,
      activeCount,
      activeCountByImprovementCost,
      isMaximumCountReached,
      isMaximumUnfamiliarCountReached,
      imitationszauberei,
      isEntryAvailable,
      prerequisiteCapabilities,
      id => getIsUnfamiliar(createIdentifierObject("Ritual", id)),
    ),
)

/**
 * Returns all curses with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const selectVisibleInactiveCurses = createSelector(
  SelectAll.Static.Curses,
  SelectGetById.Dynamic.Curse,
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
  SelectAll.Static.ElvenMagicalSongs,
  SelectGetById.Dynamic.ElvenMagicalSong,
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
  SelectAll.Static.DominationRituals,
  SelectGetById.Dynamic.DominationRitual,
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
  SelectAll.Static.MagicalDances,
  SelectGetById.Dynamic.MagicalDance,
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
  SelectAll.Static.MagicalMelodies,
  SelectGetById.Dynamic.MagicalMelody,
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
  SelectAll.Static.JesterTricks,
  SelectGetById.Dynamic.JesterTrick,
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
  SelectAll.Static.AnimistPowers,
  SelectGetById.Dynamic.AnimistPower,
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
  SelectAll.Static.GeodeRituals,
  SelectGetById.Dynamic.GeodeRitual,
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
  SelectAll.Static.ZibiljaRituals,
  SelectGetById.Dynamic.ZibiljaRitual,
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
