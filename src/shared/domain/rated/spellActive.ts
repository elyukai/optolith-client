import { Cantrip } from "optolith-database-schema/types/Cantrip"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Ritual } from "optolith-database-schema/types/Ritual"
import { Spell } from "optolith-database-schema/types/Spell"
import { PropertyReference } from "optolith-database-schema/types/_SimpleReferences"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { AnimistPower } from "optolith-database-schema/types/magicalActions/AnimistPower"
import { Curse } from "optolith-database-schema/types/magicalActions/Curse"
import { DominationRitual } from "optolith-database-schema/types/magicalActions/DominationRitual"
import { ElvenMagicalSong } from "optolith-database-schema/types/magicalActions/ElvenMagicalSong"
import { GeodeRitual } from "optolith-database-schema/types/magicalActions/GeodeRitual"
import { JesterTrick } from "optolith-database-schema/types/magicalActions/JesterTrick"
import { MagicalDance } from "optolith-database-schema/types/magicalActions/MagicalDance"
import { MagicalMelody } from "optolith-database-schema/types/magicalActions/MagicalMelody"
import { ZibiljaRitual } from "optolith-database-schema/types/magicalActions/ZibiljaRitual"
import { isNotNullish } from "../../utils/nullable.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import {
  Activatable,
  TinyActivatable,
  isTinyActivatableActive,
} from "../activatable/activatableEntry.ts"
import { FilterApplyingRatedDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { GetById } from "../getTypes.ts"
import { getHighestAttributeValue } from "./attribute.ts"
import {
  ActivatableRated,
  ActivatableRatedMap,
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
  ActiveActivatableRated,
  ActiveActivatableRatedWithEnhancements,
  Rated,
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "./ratedEntry.ts"
import {
  getSpellworkMaximum,
  getSpellworkMinimum,
  isSpellworkDecreasable,
  isSpellworkIncreasable,
} from "./spellActiveBounds.ts"

/**
 * A static active cantrip for combination with other types.
 */
export type DisplayedActiveCantrip = {
  kind: "cantrip"
  static: Cantrip
  isUnfamiliar: boolean
}

/**
 * A combination of a static and corresponding dynamic active spell entry,
 * extended by value bounds, and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedActiveSpell = {
  kind: "spell"
  static: Spell
  dynamic: ActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  isUnfamiliar: boolean
}

/**
 * A combination of a static and corresponding dynamic active ritual entry,
 * extended by value bounds, and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedActiveRitual = {
  kind: "ritual"
  static: Ritual
  dynamic: ActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  isUnfamiliar: boolean
}

type DisplayedActiveMagicalActionBase<Kind extends string, Static> = {
  kind: Kind
  static: Static
  dynamic: ActivatableRated
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
export type DisplayedActiveAnimistPower = DisplayedActiveMagicalActionBase<
  "animistPower",
  AnimistPower
>

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
 * A union of all displayed active spellwork and magical action kinds.
 */
export type DisplayedActiveSpellwork =
  | DisplayedActiveCantrip
  | DisplayedActiveSpell
  | DisplayedActiveRitual
  | DisplayedActiveMagicalAction

/**
 * Filters the given list of active cantrips by tradition.
 */
export const getVisibleActiveCantrips = (
  getStaticCantripById: GetById.Static.Cantrip,
  dynamicCantrips: TinyActivatable[],
  getIsUnfamiliar: (id: number) => boolean,
): DisplayedActiveCantrip[] =>
  dynamicCantrips
    .filter(isTinyActivatableActive)
    .map(dynamicCantrip => getStaticCantripById(dynamicCantrip.id))
    .filter(isNotNullish)
    .map(staticCantrip => ({
      kind: "cantrip",
      static: staticCantrip,
      isUnfamiliar: getIsUnfamiliar(staticCantrip.id),
    }))

/**
 * Returns all active spellworks with their corresponding dynamic
 * entries, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 * @param kind The value for the `kind` property.
 * @param staticSpellworks A map of static spells or rituals.
 * @param dynamicSpellworks A map of dynamic spells or rituals.
 * @param isInCharacterCreation Whether the character is in character creation.
 * @param startExperienceLevel The start experience level.
 * @param canRemove Whether spells or rituals can be removed.
 * @param exceptionalSkill The dynamic *Exceptional Skill* entry.
 * @param getAttributeById A function that returns a dynamic attribute entry by
 * identifier.
 * @param filterApplyingDependencies A function that filters a list of
 * dependencies by if they apply to the entry.
 * @param spellworksAbove10ByProperty A map from property identifiers to the
 * number of spells or rituals above 10 that have that aspect.
 * @param activePropertyKnowledges A list of properties that have an active
 * property knowledge.
 * @param getIsUnfamiliar Returns if the spell or ritual (depending on the
 * `kind` parameter) is unfamiliar.
 */
export const getActiveSpellsOrRituals = <K extends "spell" | "ritual", T extends Spell | Ritual>(
  kind: K,
  staticSpellworks: Record<number, T>,
  dynamicSpellworks: ActivatableRatedWithEnhancementsMap,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  canRemove: boolean,
  exceptionalSkill: Activatable | undefined,
  getAttributeById: (id: number) => Rated | undefined,
  filterApplyingDependencies: FilterApplyingRatedDependencies,
  spellworksAbove10ByProperty: Record<number, number>,
  activePropertyKnowledges: number[],
  getIsUnfamiliar: (id: number) => boolean,
): {
  kind: K
  static: T
  dynamic: ActiveActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
  isUnfamiliar: boolean
}[] =>
  Object.values(dynamicSpellworks)
    .filter(isRatedWithEnhancementsActive)
    .map(dynamicSpellwork => {
      const staticSpellwork = staticSpellworks[dynamicSpellwork.id]

      if (staticSpellwork === undefined) {
        return undefined
      }

      const minimum = getSpellworkMinimum(
        spellworksAbove10ByProperty,
        activePropertyKnowledges,
        staticSpellwork,
        dynamicSpellwork,
        filterApplyingDependencies,
      )

      const maximum = getSpellworkMaximum(
        refs => getHighestAttributeValue(getAttributeById, refs),
        activePropertyKnowledges,
        staticSpellwork,
        isInCharacterCreation,
        startExperienceLevel,
        exceptionalSkill,
        (() => {
          switch (kind) {
            case "spell":
              return "Spell"
            case "ritual":
              return "Ritual"
            default:
              return assertExhaustive(kind)
          }
        })(),
      )

      return {
        kind,
        static: staticSpellwork,
        dynamic: dynamicSpellwork,
        minimum,
        maximum,
        isDecreasable: isSpellworkDecreasable(dynamicSpellwork, minimum, canRemove),
        isIncreasable: isSpellworkIncreasable(dynamicSpellwork, maximum),
        isUnfamiliar: getIsUnfamiliar(dynamicSpellwork.id),
      }
    })
    .filter(isNotNullish)

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
  staticMagicalActions: Record<number, T>,
  dynamicMagicalActions: ActivatableRatedMap,
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
      const staticMagicalAction = staticMagicalActions[dynamicMagicalAction.id]

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
