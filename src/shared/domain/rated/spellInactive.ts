import { Cantrip } from "optolith-database-schema/types/Cantrip"
import { Ritual } from "optolith-database-schema/types/Ritual"
import { Spell } from "optolith-database-schema/types/Spell"
import { AnimistPower } from "optolith-database-schema/types/magicalActions/AnimistPower"
import { Curse } from "optolith-database-schema/types/magicalActions/Curse"
import { DominationRitual } from "optolith-database-schema/types/magicalActions/DominationRitual"
import { ElvenMagicalSong } from "optolith-database-schema/types/magicalActions/ElvenMagicalSong"
import { GeodeRitual } from "optolith-database-schema/types/magicalActions/GeodeRitual"
import { JesterTrick } from "optolith-database-schema/types/magicalActions/JesterTrick"
import { MagicalDance } from "optolith-database-schema/types/magicalActions/MagicalDance"
import { MagicalMelody } from "optolith-database-schema/types/magicalActions/MagicalMelody"
import { ZibiljaRitual } from "optolith-database-schema/types/magicalActions/ZibiljaRitual"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import {
  Activatable,
  TinyActivatableSet,
  firstLevel,
  getFirstOptionOfType,
} from "../activatable/activatableEntry.ts"
import { CombinedActiveMagicalTradition } from "../activatable/magicalTradition.ts"
import {
  ImprovementCost,
  compareImprovementCost,
  fromRaw,
} from "../adventurePoints/improvementCost.ts"
import { GetById } from "../getTypes.ts"
import { MagicalTraditionIdentifier } from "../identifier.ts"
import { checkPrerequisitesOfSpellwork } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import {
  ActivatableRated,
  ActivatableRatedMap,
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
  isOptionalRatedActive,
  isOptionalRatedWithEnhancementsActive,
} from "./ratedEntry.ts"
import { isTraditionActive } from "./spell.ts"

/**
 * A static active cantrip for combination with other types, extended by whether
 * the entry can be activated.
 */
export type DisplayedInactiveCantrip = {
  kind: "cantrip"
  static: Cantrip
  isUnfamiliar: boolean
}

/**
 * A combination of a static and corresponding dynamic inactive spell entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveSpell = {
  kind: "spell"
  static: Spell
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
  isUnfamiliar: boolean
}

/**
 * A combination of a static and corresponding dynamic inactive ritual entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveRitual = {
  kind: "ritual"
  static: Ritual
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
  isUnfamiliar: boolean
}

type DisplayedInactiveMagicalActionBase<Kind extends string, Static> = {
  kind: Kind
  static: Static
  dynamic: ActivatableRated | undefined
  isAvailable: boolean
}

/**
 * A combination of a static and corresponding dynamic inactive curse entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveCurse = DisplayedInactiveMagicalActionBase<"curse", Curse>

/**
 * A combination of a static and corresponding dynamic inactive elven magical song entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveElvenMagicalSong = DisplayedInactiveMagicalActionBase<
  "elvenMagicalSong",
  ElvenMagicalSong
>

/**
 * A combination of a static and corresponding dynamic inactive domination ritual entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveDominationRitual = DisplayedInactiveMagicalActionBase<
  "dominationRitual",
  DominationRitual
>

/**
 * A combination of a static and corresponding dynamic inactive magical dance entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveMagicalDance = DisplayedInactiveMagicalActionBase<
  "magicalDance",
  MagicalDance
>

/**
 * A combination of a static and corresponding dynamic inactive magical melody entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveMagicalMelody = DisplayedInactiveMagicalActionBase<
  "magicalMelody",
  MagicalMelody
>

/**
 * A combination of a static and corresponding dynamic inactive jester trick entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveJesterTrick = DisplayedInactiveMagicalActionBase<
  "jesterTrick",
  JesterTrick
>

/**
 * A combination of a static and corresponding dynamic inactive animist power entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveAnimistPower = DisplayedInactiveMagicalActionBase<
  "animistPower",
  AnimistPower
>

/**
 * A combination of a static and corresponding dynamic inactive geode ritual entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveGeodeRitual = DisplayedInactiveMagicalActionBase<
  "geodeRitual",
  GeodeRitual
>

/**
 * A combination of a static and corresponding dynamic inactive zibilja ritual entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveZibiljaRitual = DisplayedInactiveMagicalActionBase<
  "zibiljaRitual",
  ZibiljaRitual
>

/**
 * A union of all displayed inactive magical action kinds.
 */
export type DisplayedInactiveMagicalAction =
  | DisplayedInactiveCurse
  | DisplayedInactiveElvenMagicalSong
  | DisplayedInactiveDominationRitual
  | DisplayedInactiveMagicalDance
  | DisplayedInactiveMagicalMelody
  | DisplayedInactiveJesterTrick
  | DisplayedInactiveAnimistPower
  | DisplayedInactiveGeodeRitual
  | DisplayedInactiveZibiljaRitual

/**
 * A union of all displayed inactive spellwork and magical action kinds.
 */
export type DisplayedInactiveSpellwork =
  | DisplayedInactiveCantrip
  | DisplayedInactiveSpell
  | DisplayedInactiveRitual
  | DisplayedInactiveMagicalAction

/**
 * Filters the given list of inactive cantrips by tradition.
 */
export const getVisibleInactiveCantrips = (
  staticCantrips: Record<number, Cantrip>,
  dynamicCantrips: TinyActivatableSet,
  activeTraditions: CombinedActiveMagicalTradition[],
  getIsEntryAvailable: (src: PublicationRefs) => boolean,
  getIsUnfamiliar: (id: number) => boolean,
): DisplayedInactiveCantrip[] =>
  activeTraditions.some(active => !active.static.can_learn_cantrips)
    ? []
    : Object.values(staticCantrips)
        .filter(
          cantrip =>
            !dynamicCantrips.includes(cantrip.id) &&
            getIsEntryAvailable(cantrip.src) &&
            (cantrip.note?.tag !== "Exclusive" ||
              // if the cantrip is exclusive to specific tradition, at least one of the
              // listed traditions must be active
              cantrip.note.exclusive.traditions.some(ref =>
                activeTraditions.some(active => ref.id.magical_tradition === active.static.id),
              )),
        )
        .map(staticCantrip => ({
          kind: "cantrip",
          static: staticCantrip,
          isUnfamiliar: getIsUnfamiliar(staticCantrip.id),
        }))

/**
 * Returns all liturgical chants or ceremonies with their corresponding dynamic
 * entries, extended by whether the entry can be activated.
 *
 * If parameters are documented as counting for liturgical chants **or**
 * ceremonies, the argument should count for whether liturgical chants or
 * ceremonies are returned.
 * @param kind The value for the `kind` property.
 * @param staticSpellworks A map of static spells or rituals.
 * @param dynamicSpellworks A map of dynamic spells or rituals.
 * @param activeMagicalTraditions The active magical tradition(s).
 * @param activeCount The number of active spells, rituals and magical actions.
 * @param activeCountByImprovementCost The number of active spells, rituals and
 * magical actions, grouped by improvement cost.
 * @param isMaximumCountReached Whether the maximum count of spells and rituals
 * based on the experience level is reached. It is always `false` if the
 * experience level does not have any effect anymore.
 * @param isMaximumUnfamiliarCountReached Whether the maximum count of
 * unfamiliar spells and rituals based on the experience level is reached. It is
 * always `false` if the experience level does not have any effect anymore.
 * @param imitationszauberei The dynamic *Imitationszauberei* entry, if present.
 * @param isEntryAvailable A function that checks whether a spell or ritual is
 * available based on the active publications.
 * @param getDynamicFocusRule Returns the dynamic focus rule entry by
 * identifier, if present.
 * @param getDynamicOptionalRule Returns the dynamic optional rule entry by
 * identifier, if present.
 * @param getDynamicAttribute Returns the dynamic attribute entry by identifier,
 * if present.
 * @param getDynamicSkill Returns the dynamic skill entry by identifier, if
 * present.
 * @param getDynamicCloseCombatTechnique Returns the dynamic close combat
 * technique entry by identifier, if present.
 * @param getDynamicRangedCombatTechnique Returns the dynamic ranged combat
 * technique entry by identifier, if present.
 * @param getDynamicSpell Returns the dynamic spell entry by identifier, if
 * present.
 * @param getDynamicRitual Returns the dynamic ritual entry by identifier, if
 * present.
 * @param getDynamicLiturgicalChant Returns the dynamic liturgical chant entry
 * by identifier, if present.
 * @param getDynamicCeremony Returns the dynamic ceremony entry by identifier,
 * if present.
 * @param getIsUnfamiliar Returns if the spell or ritual (depending on the
 * `kind` parameter) is unfamiliar.
 */
export const getInactiveSpellsOrRituals = <K extends "spell" | "ritual", T extends Spell | Ritual>(
  kind: K,
  staticSpellworks: Record<number, T>,
  dynamicSpellworks: ActivatableRatedWithEnhancementsMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  activeCount: number,
  activeCountByImprovementCost: Record<ImprovementCost, number>,
  isMaximumCountReached: boolean,
  isMaximumUnfamiliarCountReached: boolean,
  imitationszauberei: Activatable | undefined,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  getDynamicFocusRule: GetById.Dynamic.FocusRule,
  getDynamicOptionalRule: GetById.Dynamic.OptionalRule,
  getDynamicAttribute: GetById.Dynamic.Attribute,
  getDynamicSkill: GetById.Dynamic.Skill,
  getDynamicCloseCombatTechnique: GetById.Dynamic.CloseCombatTechnique,
  getDynamicRangedCombatTechnique: GetById.Dynamic.RangedCombatTechnique,
  getDynamicSpell: GetById.Dynamic.Spell,
  getDynamicRitual: GetById.Dynamic.Ritual,
  getDynamicLiturgicalChant: GetById.Dynamic.LiturgicalChant,
  getDynamicCeremony: GetById.Dynamic.Ceremony,
  getIsUnfamiliar: (id: number) => boolean,
): {
  kind: K
  static: T
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
  isUnfamiliar: boolean
}[] => {
  const isAddKindDisabledByTradition: (active: CombinedActiveMagicalTradition) => boolean = (() => {
    switch (kind) {
      case "spell":
        return active => !active.static.can_learn_spells
      case "ritual":
        return active => !active.static.can_learn_rituals
      default:
        return assertExhaustive(kind)
    }
  })()

  if (activeMagicalTraditions.some(isAddKindDisabledByTradition)) {
    return []
  }

  if (
    isTraditionActive(activeMagicalTraditions, [
      MagicalTraditionIdentifier.ArcaneBards,
      MagicalTraditionIdentifier.ArcaneDancers,
    ])
  ) {
    return []
  }

  const { additionalHardPredicate, additionalSoftPredicate } = ((): {
    additionalHardPredicate: (spellwork: T) => boolean
    additionalSoftPredicate: (spellwork: T) => boolean
  } => {
    if (
      isTraditionActive(activeMagicalTraditions, [
        MagicalTraditionIdentifier.IntuitiveMages,
        MagicalTraditionIdentifier.Animisten,
      ])
    ) {
      return {
        additionalHardPredicate: staticSpellwork =>
          compareImprovementCost(fromRaw(staticSpellwork.improvement_cost), ImprovementCost.C) <= 0,
        additionalSoftPredicate: staticSpellwork =>
          activeCount < 3 &&
          (fromRaw(staticSpellwork.improvement_cost) !== ImprovementCost.C ||
            (activeCountByImprovementCost[ImprovementCost.C] ?? 0) < 1),
      }
    }

    if (isTraditionActive(activeMagicalTraditions, [MagicalTraditionIdentifier.Schelme])) {
      const maxCount = firstLevel(imitationszauberei)

      if (maxCount > 0) {
        return {
          additionalHardPredicate: staticSpellwork =>
            compareImprovementCost(fromRaw(staticSpellwork.improvement_cost), ImprovementCost.C) <=
            0,
          additionalSoftPredicate: staticSpellwork =>
            activeCount < maxCount &&
            (fromRaw(staticSpellwork.improvement_cost) !== ImprovementCost.C ||
              (activeCountByImprovementCost[ImprovementCost.C] ?? 0) < 1),
        }
      }

      return {
        additionalHardPredicate: _ => true,
        additionalSoftPredicate: _ => true,
      }
    }

    return {
      additionalHardPredicate: _ => true,
      additionalSoftPredicate: _ => true,
    }
  })()

  return Object.values(staticSpellworks)
    .filter(
      staticSpellwork =>
        isEntryAvailable(staticSpellwork.src) &&
        !isOptionalRatedWithEnhancementsActive(dynamicSpellworks[staticSpellwork.id]) &&
        additionalHardPredicate(staticSpellwork),
    )
    .map(staticSpellwork => {
      const dynamicSpellwork = dynamicSpellworks[staticSpellwork.id]
      const isUnfamiliar = getIsUnfamiliar(staticSpellwork.id)

      return {
        kind,
        static: staticSpellwork,
        dynamic: dynamicSpellwork,
        isAvailable:
          !isMaximumCountReached &&
          (!isUnfamiliar || !isMaximumUnfamiliarCountReached) &&
          additionalSoftPredicate(staticSpellwork) &&
          checkPrerequisitesOfSpellwork(staticSpellwork.prerequisites ?? [], {
            getDynamicFocusRule,
            getDynamicOptionalRule,
            getDynamicAttribute,
            getDynamicSkill,
            getDynamicCloseCombatTechnique,
            getDynamicRangedCombatTechnique,
            getDynamicSpell,
            getDynamicRitual,
            getDynamicLiturgicalChant,
            getDynamicCeremony,
          }),
        isUnfamiliar,
      }
    })
}

const getInactiveMagicalActions = <
  K extends string,
  T extends { id: number; src: PublicationRefs },
>(
  kind: K,
  staticMagicalActions: Record<number, T>,
  dynamicMagicalActions: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  associatedMagicalTraditionId: MagicalTraditionIdentifier | MagicalTraditionIdentifier[],
  options: {
    additionalHardPredicate?: (staticMagicalAction: T) => boolean
  } = {},
): {
  kind: K
  static: T
  dynamic: ActivatableRated | undefined
  isAvailable: boolean
}[] => {
  if (
    isTraditionActive(
      activeMagicalTraditions,
      Array.isArray(associatedMagicalTraditionId)
        ? associatedMagicalTraditionId
        : [associatedMagicalTraditionId],
    )
  ) {
    return Object.values(staticMagicalActions)
      .filter(
        staticMagicalAction =>
          isEntryAvailable(staticMagicalAction.src) &&
          !isOptionalRatedActive(dynamicMagicalActions[staticMagicalAction.id]) &&
          (options.additionalHardPredicate?.(staticMagicalAction) ?? true),
      )
      .map(staticMagicalAction => {
        const dynamicMagicalAction = dynamicMagicalActions[staticMagicalAction.id]

        return {
          kind,
          static: staticMagicalAction,
          dynamic: dynamicMagicalAction,
          isAvailable: !isMaximumCountReached,
        }
      })
  }

  return []
}

/**
 * Returns all curses with their corresponding dynamic entries, extended by
 * whether the entry can be activated.
 */
export const getInactiveCurses = (
  staticCurses: Record<number, Curse>,
  dynamicCurses: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveCurse[] =>
  getInactiveMagicalActions(
    "curse",
    staticCurses,
    dynamicCurses,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Witches,
  )

/**
 * Returns all elven magical songs with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const getInactiveElvenMagicalSongs = (
  staticElvenMagicalSongs: Record<number, ElvenMagicalSong>,
  dynamicElvenMagicalSongs: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveElvenMagicalSong[] =>
  getInactiveMagicalActions(
    "elvenMagicalSong",
    staticElvenMagicalSongs,
    dynamicElvenMagicalSongs,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Elves,
  )

/**
 * Returns all domination rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const getInactiveDominationRituals = (
  staticDominationRituals: Record<number, DominationRitual>,
  dynamicDominationRituals: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveDominationRitual[] =>
  getInactiveMagicalActions(
    "dominationRitual",
    staticDominationRituals,
    dynamicDominationRituals,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Druids,
  )

/**
 * Returns all magical dances with their corresponding dynamic entries, extended
 * by whether the entry can be activated.
 */
export const getInactiveMagicalDances = (
  staticMagicalDances: Record<number, MagicalDance>,
  dynamicMagicalDances: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveMagicalDance[] => {
  const activeMusicTraditionId = getFirstOptionOfType(
    activeMagicalTraditions[0]?.dynamic,
    "ArcaneDancerTradition",
  )

  if (activeMusicTraditionId === undefined) {
    return []
  }

  return getInactiveMagicalActions(
    "magicalDance",
    staticMagicalDances,
    dynamicMagicalDances,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.ArcaneDancers,
    {
      additionalHardPredicate: staticMagicalDance =>
        staticMagicalDance.music_tradition.some(trad => trad.id === activeMusicTraditionId),
    },
  )
}

/**
 * Returns all magical melodies with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const getInactiveMagicalMelodies = (
  staticMagicalMelodies: Record<number, MagicalMelody>,
  dynamicMagicalMelodies: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveMagicalMelody[] => {
  const activeMusicTraditionId = getFirstOptionOfType(
    activeMagicalTraditions[0]?.dynamic,
    "ArcaneBardTradition",
  )

  if (activeMusicTraditionId === undefined) {
    return []
  }

  return getInactiveMagicalActions(
    "magicalMelody",
    staticMagicalMelodies,
    dynamicMagicalMelodies,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.ArcaneBards,
    {
      additionalHardPredicate: staticMagicalMelody =>
        staticMagicalMelody.music_tradition.some(trad => trad.id === activeMusicTraditionId),
    },
  )
}

/**
 * Returns all jester trick with their corresponding dynamic entries, extended
 * by whether the entry can be activated.
 */
export const getInactiveJesterTricks = (
  staticJesterTricks: Record<number, JesterTrick>,
  dynamicJesterTricks: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveJesterTrick[] =>
  getInactiveMagicalActions(
    "jesterTrick",
    staticJesterTricks,
    dynamicJesterTricks,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Schelme,
  )

/**
 * Returns all animist powers with their corresponding dynamic entries, extended
 * by whether the entry can be activated.
 */
export const getInactiveAnimistPowers = (
  staticAnimistPowers: Record<number, AnimistPower>,
  dynamicAnimistPowers: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveAnimistPower[] =>
  getInactiveMagicalActions(
    "animistPower",
    staticAnimistPowers,
    dynamicAnimistPowers,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Animisten,
  )

/**
 * Returns all geode rituals with their corresponding dynamic entries, extended
 * by whether the entry can be activated.
 */
export const getInactiveGeodeRituals = (
  staticGeodeRituals: Record<number, GeodeRitual>,
  dynamicGeodeRituals: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveGeodeRitual[] =>
  getInactiveMagicalActions(
    "geodeRitual",
    staticGeodeRituals,
    dynamicGeodeRituals,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    [MagicalTraditionIdentifier.Geoden, MagicalTraditionIdentifier.BrobimGeoden],
  )

/**
 * Returns all zibilja rituals with their corresponding dynamic entries,
 * extended by whether the entry can be activated.
 */
export const getInactiveZibiljaRituals = (
  staticZibiljaRituals: Record<number, ZibiljaRitual>,
  dynamicZibiljaRituals: ActivatableRatedMap,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveZibiljaRitual[] =>
  getInactiveMagicalActions(
    "zibiljaRitual",
    staticZibiljaRituals,
    dynamicZibiljaRituals,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Zibilijas,
  )
