import { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import {
  AnimistPower,
  Curse,
  DominationRitual,
  ElvenMagicalSong,
  GeodeRitual,
  JesterTrick,
  MagicalDance,
  MagicalMelody,
  PublicationRefs,
  ZibiljaRitual,
} from "@optolith/database-schema/gen"
import { MagicalTraditionIdentifier } from "@optolith/database-schema/types/_Identifier"
import { CombinedActiveMagicalTradition } from "../activatable/magicalTradition.ts"
import { getImprovementCostForAnimistPower } from "./animistPower.ts"
import { ActivatableRated, isOptionalRatedActive } from "./ratedEntry.ts"

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
export type DisplayedInactiveAnimistPower = {
  kind: "animistPower"
  static: AnimistPower
  dynamic: ActivatableRated | undefined
  isAvailable: boolean
  improvementCost: ImprovementCost
}

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

const getInactiveMagicalActions = <
  K extends string,
  T extends { id: number; src: PublicationRefs },
>(
  kind: K,
  staticMagicalActions: T[],
  getDynamicMagicalActionById: (id: number) => ActivatableRated | undefined,
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
    return staticMagicalActions
      .filter(
        staticMagicalAction =>
          isEntryAvailable(staticMagicalAction.src) &&
          !isOptionalRatedActive(getDynamicMagicalActionById(staticMagicalAction.id)) &&
          (options.additionalHardPredicate?.(staticMagicalAction) ?? true),
      )
      .map(staticMagicalAction => {
        const dynamicMagicalAction = getDynamicMagicalActionById(staticMagicalAction.id)

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
  staticCurses: All.Static.Curses,
  getDynamicCurseById: GetById.Dynamic.Curse,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveCurse[] =>
  getInactiveMagicalActions(
    "curse",
    staticCurses,
    getDynamicCurseById,
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
  staticElvenMagicalSongs: All.Static.ElvenMagicalSongs,
  getDynamicElvenMagicalSongById: GetById.Dynamic.ElvenMagicalSong,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveElvenMagicalSong[] =>
  getInactiveMagicalActions(
    "elvenMagicalSong",
    staticElvenMagicalSongs,
    getDynamicElvenMagicalSongById,
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
  staticDominationRituals: All.Static.DominationRituals,
  getDynamicDominationRitualById: GetById.Dynamic.DominationRitual,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveDominationRitual[] =>
  getInactiveMagicalActions(
    "dominationRitual",
    staticDominationRituals,
    getDynamicDominationRitualById,
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
  staticMagicalDances: All.Static.MagicalDances,
  getDynamicMagicalDanceById: GetById.Dynamic.MagicalDance,
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
    getDynamicMagicalDanceById,
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
  staticMagicalMelodies: All.Static.MagicalMelodies,
  getDynamicMagicalMelodyById: GetById.Dynamic.MagicalMelody,
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
    getDynamicMagicalMelodyById,
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
  staticJesterTricks: All.Static.JesterTricks,
  getDynamicJesterTrickById: GetById.Dynamic.JesterTrick,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveJesterTrick[] =>
  getInactiveMagicalActions(
    "jesterTrick",
    staticJesterTricks,
    getDynamicJesterTrickById,
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
  staticAnimistPowers: All.Static.AnimistPowers,
  getDynamicAnimistPowerById: GetById.Dynamic.AnimistPower,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  getStaticPatronById: GetById.Static.Patron,
  traditionAnimists: Activatable,
): DisplayedInactiveAnimistPower[] =>
  getInactiveMagicalActions(
    "animistPower",
    staticAnimistPowers,
    getDynamicAnimistPowerById,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Animisten,
  )
    .map(animistPower => ({
      ...animistPower,
      improvementCost: getImprovementCostForAnimistPower(
        getStaticPatronById,
        traditionAnimists,
        animistPower.static.improvement_cost,
      ),
    }))
    .filter(
      (animistPower): animistPower is DisplayedInactiveAnimistPower =>
        animistPower.improvementCost !== undefined,
    )

/**
 * Returns all geode rituals with their corresponding dynamic entries, extended
 * by whether the entry can be activated.
 */
export const getInactiveGeodeRituals = (
  staticGeodeRituals: All.Static.GeodeRituals,
  getDynamicGeodeRitualById: GetById.Dynamic.GeodeRitual,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveGeodeRitual[] =>
  getInactiveMagicalActions(
    "geodeRitual",
    staticGeodeRituals,
    getDynamicGeodeRitualById,
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
  staticZibiljaRituals: All.Static.ZibiljaRituals,
  getDynamicZibiljaRitualById: GetById.Dynamic.ZibiljaRitual,
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  isMaximumCountReached: boolean,
  isEntryAvailable: (src: PublicationRefs) => boolean,
): DisplayedInactiveZibiljaRitual[] =>
  getInactiveMagicalActions(
    "zibiljaRitual",
    staticZibiljaRituals,
    getDynamicZibiljaRitualById,
    activeMagicalTraditions,
    isMaximumCountReached,
    isEntryAvailable,
    MagicalTraditionIdentifier.Zibilijas,
  )
