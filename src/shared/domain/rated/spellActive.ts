import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import {
  AnimistPower,
  Curse,
  DominationRitual,
  ElvenMagicalSong,
  ExperienceLevel,
  GeodeRitual,
  JesterTrick,
  MagicalDance,
  MagicalMelody,
  SkillCheck,
  ZibiljaRitual,
} from "@optolith/database-schema/gen"
import { isNotNullish } from "../../utils/nullable.ts"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { ActivatableRated, ActiveActivatableRated, isRatedActive } from "./ratedEntry.ts"

type DisplayedActiveMagicalActionBase<Kind extends string, Static> = {
  kind: Kind
  static: Static
  dynamic: ActiveActivatableRated
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
}

/**
 * A combination of a static and corresponding dynamic active curse entry,
 * extended by value bounds, and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedActiveCurse = DisplayedActiveMagicalActionBase<"curse", Curse>

/**
 * A combination of a static and corresponding dynamic active elven magical song
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveElvenMagicalSong = DisplayedActiveMagicalActionBase<
  "elvenMagicalSong",
  ElvenMagicalSong
>

/**
 * A combination of a static and corresponding dynamic active domination ritual
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveDominationRitual = DisplayedActiveMagicalActionBase<
  "dominationRitual",
  DominationRitual
>

/**
 * A combination of a static and corresponding dynamic active magical dance
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveMagicalDance = DisplayedActiveMagicalActionBase<
  "magicalDance",
  MagicalDance
>

/**
 * A combination of a static and corresponding dynamic active magical melody
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveMagicalMelody = DisplayedActiveMagicalActionBase<
  "magicalMelody",
  MagicalMelody
>

/**
 * A combination of a static and corresponding dynamic active jester trick
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveJesterTrick = DisplayedActiveMagicalActionBase<
  "jesterTrick",
  JesterTrick
>

/**
 * A combination of a static and corresponding dynamic active animist power
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveAnimistPower = {
  kind: "animistPower"
  static: AnimistPower
  dynamic: ActiveActivatableRated
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  improvementCost: ImprovementCost
}

/**
 * A combination of a static and corresponding dynamic active geode ritual
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveGeodeRitual = DisplayedActiveMagicalActionBase<
  "geodeRitual",
  GeodeRitual
>

/**
 * A combination of a static and corresponding dynamic active zibilja ritual
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveZibiljaRitual = DisplayedActiveMagicalActionBase<
  "zibiljaRitual",
  ZibiljaRitual
>

/**
 * A union of all displayed active magical action kinds.
 */
export type DisplayedActiveMagicalAction =
  | DisplayedActiveCurse
  | DisplayedActiveElvenMagicalSong
  | DisplayedActiveDominationRitual
  | DisplayedActiveMagicalDance
  | DisplayedActiveMagicalMelody
  | DisplayedActiveJesterTrick
  | DisplayedActiveAnimistPower
  | DisplayedActiveGeodeRitual
  | DisplayedActiveZibiljaRitual

/**
 * Returns all active magical actions of a single kind with their corresponding
 * dynamic entries, extended by value bounds, and full logic for if the value
 * can be increased or decreased.
 */
export const getActiveMagicalActions = <
  K extends DisplayedActiveMagicalAction["kind"],
  T extends { id: number; check: SkillCheck; property: PropertyReference },
>(
  kind: K,
  getStaticMagicalActionById: (id: number) => T | undefined,
  dynamicMagicalActions: ActivatableRated[],
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  canRemove: boolean,
  getAttributeById: (id: number) => Rated | undefined,
  filterApplyingDependencies: FilterApplyingRatedDependencies,
  spellworksAbove10ByProperty: Record<number, number>,
  activePropertyKnowledges: number[],
): {
  kind: K
  static: T
  dynamic: ActiveActivatableRated
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
}[] =>
  Object.values(dynamicMagicalActions)
    .filter(isRatedActive)
    .map(dynamicMagicalAction => {
      const staticMagicalAction = getStaticMagicalActionById(dynamicMagicalAction.id)

      if (staticMagicalAction === undefined) {
        return undefined
      }

      const minimum = getSpellworkMinimum(
        spellworksAbove10ByProperty,
        activePropertyKnowledges,
        staticMagicalAction,
        dynamicMagicalAction,
        filterApplyingDependencies,
      )

      const maximum = getSpellworkMaximum(
        refs => getHighestAttributeValue(getAttributeById, refs),
        activePropertyKnowledges,
        staticMagicalAction,
        isInCharacterCreation,
        startExperienceLevel,
        undefined,
        (() => {
          switch (kind) {
            case "curse":
              return "Curse"
            case "elvenMagicalSong":
              return "ElvenMagicalSong"
            case "dominationRitual":
              return "DominationRitual"
            case "magicalMelody":
              return "MagicalMelody"
            case "magicalDance":
              return "MagicalDance"
            case "jesterTrick":
              return "JesterTrick"
            case "animistPower":
              return "AnimistPower"
            case "geodeRitual":
              return "GeodeRitual"
            case "zibiljaRitual":
              return "ZibiljaRitual"
            default:
              return assertExhaustive(kind)
          }
        })(),
      )

      return {
        kind,
        static: staticMagicalAction,
        dynamic: dynamicMagicalAction,
        minimum,
        maximum,
        isDecreasable: isSpellworkDecreasable(dynamicMagicalAction, minimum, canRemove),
        isIncreasable: isSpellworkIncreasable(dynamicMagicalAction, maximum),
      }
    })
    .filter(isNotNullish)
