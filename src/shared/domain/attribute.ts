import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { Race } from "optolith-database-schema/types/Race"
import { Ritual } from "optolith-database-schema/types/Ritual"
import { Skill } from "optolith-database-schema/types/Skill"
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
import { mapNullable, mapNullableDefault } from "../utils/nullable.ts"
import { Activatable } from "./activatableEntry.ts"
import { getHighestRequiredAttributeForCombatTechnique } from "./combatTechnique.ts"
import { Energy, EnergyWithBuyBack } from "./energy.ts"
import { AttributeIdentifier } from "./identifier.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedWithEnhancementsMap,
  Dependency,
  Rated,
  RatedMap,
  flattenMinimumRestrictions,
} from "./ratedEntry.ts"
import { getHighestRequiredAttributeForSkill } from "./skill.ts"

export const getAttributeValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 8

export const getAttributeMinimum = (
  lifePoints: Energy,
  arcaneEnergy: EnergyWithBuyBack,
  karmaPoints: EnergyWithBuyBack,
  dynamicAttribute: Rated,
  singleHighestMagicalPrimaryAttributeId: number | undefined,
  magicalPrimaryAttributeDependencies: Dependency[],
  blessedPrimaryAttributeId: number | undefined,
  blessedPrimaryAttributeDependencies: Dependency[],
  filterApplyingDependencies: (dependencies: Dependency[]) => Dependency[],
  getSkillCheckAttributeMinimum: (id: number) => number | undefined,
): number => {
  const isConstitution = dynamicAttribute.id === AttributeIdentifier.Constitution
  const isHighestMagicalPrimaryAttribute =
    dynamicAttribute.id === singleHighestMagicalPrimaryAttributeId
  const isBlessedPrimaryAttribute = dynamicAttribute.id === blessedPrimaryAttributeId

  const minimumValues: number[][] = [
    [8],
    flattenMinimumRestrictions(filterApplyingDependencies(dynamicAttribute.dependencies)),
    isConstitution ? [lifePoints.purchased] : [],
    isHighestMagicalPrimaryAttribute
      ? [arcaneEnergy.purchased, ...flattenMinimumRestrictions(magicalPrimaryAttributeDependencies)]
      : [],
    isBlessedPrimaryAttribute
      ? [karmaPoints.purchased, ...flattenMinimumRestrictions(blessedPrimaryAttributeDependencies)]
      : [],
    mapNullable(getSkillCheckAttributeMinimum(dynamicAttribute.id), min => [min]) ?? [],
  ]

  return Math.max(...minimumValues.flat())
}

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments.selectable?.find(adjustment =>
    adjustment.list.some(attribute => attribute.id.attribute === id),
  )?.value ?? 0

const getModIfStaticAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments.fixed
    ?.filter(adjustment => adjustment.id.attribute === id)
    .reduce((acc, adjustment) => acc + adjustment.value, 0) ?? 0

export const getAttributeMaximum = (
  isInCharacterCreation: boolean,
  race: Race | undefined,
  startExperienceLevel: ExperienceLevel | undefined,
  currentExperienceLevel: ExperienceLevel | undefined,
  isAttributeValueLimitEnabled: boolean,
  adjustmentId: number | undefined,
  id: number,
): number | undefined => {
  if (isInCharacterCreation && race !== undefined && startExperienceLevel !== undefined) {
    const selectedAdjustment = adjustmentId === id ? getModIfSelectedAdjustment(id, race) : 0
    const staticAdjustment = getModIfStaticAdjustment(id, race)

    return startExperienceLevel.max_attribute_value + selectedAdjustment + staticAdjustment
  }

  if (isAttributeValueLimitEnabled && currentExperienceLevel !== undefined) {
    return currentExperienceLevel.max_attribute_value + 2
  }

  return undefined
}

export const isAttributeDecreasable = (dynamic: Rated, min: number) => min < dynamic.value

export const isAttributeIncreasable = (
  dynamic: Rated,
  max: number | undefined,
  totalPoints: number,
  maxTotalPoints: number,
  isInCharacterCreation: boolean,
) =>
  (!isInCharacterCreation || totalPoints < maxTotalPoints) &&
  (max === undefined || dynamic.value < max)

/**
 * Returns the highest attribute from a list, if it higher than all other
 * attributes from that list. More than one with the highest value will result
 * in returning `undefined`.
 */
export const getSingleHighestAttribute = (
  attributes: { id: number; value: number }[],
): { id: number; value: number } | undefined => {
  type IntermediateResult = { id: number | "multiple"; value: number } | undefined

  const intermediateResult = attributes.reduce<IntermediateResult>(
    (currentHighest, attr) =>
      currentHighest === undefined || attr.value > currentHighest.value
        ? attr
        : attr.value === currentHighest.value && attr.id !== currentHighest.id
        ? // different attributes with the same value, if it’s already "multiple"
          // it stays "multiple", in which case the id comparison will always be
          // true
          { id: "multiple", value: currentHighest.value }
        : currentHighest,
    undefined,
  )

  const isSingleHighest = (res: IntermediateResult): res is { id: number; value: number } =>
    res !== undefined && res.id !== "multiple"

  return isSingleHighest(intermediateResult) ? intermediateResult : undefined
}

const getAttributeMinimaForEntity = <
  D extends { id: number; value: number | undefined },
  S extends {},
>(
  dynamicMap: Record<number, D>,
  staticMap: Record<number, S>,
  getHighestRequiredAttributeForEntry: (
    dynamicEntry: D,
    staticEntry: S,
  ) => { id: number; value: number } | undefined,
): { id: number; value: number }[] =>
  Object.values(dynamicMap).flatMap(dynamicEntry =>
    // optimize performance by filtering out all entries that are below the
    // attribute minimum of 8
    (dynamicEntry.value ?? 0) < 8
      ? []
      : mapNullableDefault(
          mapNullable(staticMap[dynamicEntry.id], staticEntry =>
            getHighestRequiredAttributeForEntry(dynamicEntry, staticEntry),
          ),
          x => [x],
          [],
        ),
  )

/**
 * Returns the accumulated minimum values for attributes based on the associated
 * attributes of all entries with ratings (skills, combat techniques,
 * spellworks, magical actions, liturgical chants). Associated attributes means
 * either the check attributes (for all except combat techniques) or the primary
 * attributes (combat techniques). This covers the implied dependency of the
 * rule that allows a rating to be as high as the highest associated attribute +
 * 2, maybe further increased by entries such as *Exceptional Skill* or
 * *Exceptional Combat Technique*.
 */
export const getAttributeMinimaByAssociatedAttributes = (
  staticSkills: Record<number, Skill>,
  staticCloseCombatTechniques: Record<number, CloseCombatTechnique>,
  staticRangedCombatTechniques: Record<number, RangedCombatTechnique>,
  staticSpells: Record<number, Spell>,
  staticRituals: Record<number, Ritual>,
  staticLiturgicalChants: Record<number, LiturgicalChant>,
  staticCeremonies: Record<number, Ceremony>,
  staticCurses: Record<number, Curse>,
  staticElvenMagicalSongs: Record<number, ElvenMagicalSong>,
  staticDominationRituals: Record<number, DominationRitual>,
  staticMagicalDances: Record<number, MagicalDance>,
  staticMagicalMelodies: Record<number, MagicalMelody>,
  staticJesterTricks: Record<number, JesterTrick>,
  staticAnimistPowers: Record<number, AnimistPower>,
  staticGeodeRituals: Record<number, GeodeRitual>,
  staticZibiljaRituals: Record<number, ZibiljaRitual>,
  attributes: RatedMap,
  dynamicSkills: RatedMap,
  dynamicCloseCombatTechniques: RatedMap,
  dynamicRangedCombatTechniques: RatedMap,
  dynamicSpells: ActivatableRatedWithEnhancementsMap,
  dynamicRituals: ActivatableRatedWithEnhancementsMap,
  dynamicLiturgicalChants: ActivatableRatedWithEnhancementsMap,
  dynamicCeremonies: ActivatableRatedWithEnhancementsMap,
  dynamicCurses: ActivatableRatedMap,
  dynamicElvenMagicalSongs: ActivatableRatedMap,
  dynamicDominationRituals: ActivatableRatedMap,
  dynamicMagicalDances: ActivatableRatedMap,
  dynamicMagicalMelodies: ActivatableRatedMap,
  dynamicJesterTricks: ActivatableRatedMap,
  dynamicAnimistPowers: ActivatableRatedMap,
  dynamicGeodeRituals: ActivatableRatedMap,
  dynamicZibiljaRituals: ActivatableRatedMap,
  exceptionalSkill: Activatable | undefined,
  exceptionalCombatTechnique: Activatable | undefined,
): Record<number, number> =>
  [
    ...getAttributeMinimaForEntity(dynamicSkills, staticSkills, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSkill(attributes, staticEntry, dynamicEntry, exceptionalSkill),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCloseCombatTechniques,
      staticCloseCombatTechniques,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          attributes,
          { tag: "CloseCombatTechnique", closeCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicRangedCombatTechniques,
      staticRangedCombatTechniques,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          attributes,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicSpells,
      staticSpells,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicRituals,
      staticRituals,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicLiturgicalChants,
      staticLiturgicalChants,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicCeremonies,
      staticCeremonies,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicCurses,
      staticCurses,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicElvenMagicalSongs,
      staticElvenMagicalSongs,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicDominationRituals,
      staticDominationRituals,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalDances,
      staticMagicalDances,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalMelodies,
      staticMagicalMelodies,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicJesterTricks,
      staticJesterTricks,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicAnimistPowers,
      staticAnimistPowers,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicGeodeRituals,
      staticGeodeRituals,
      (dynamicEntry, staticEntry) => undefined,
    ),
    ...getAttributeMinimaForEntity(
      dynamicZibiljaRituals,
      staticZibiljaRituals,
      (dynamicEntry, staticEntry) => undefined,
    ),
  ].reduce<Record<number, number>>(
    (acc, { id, value }) => ({
      ...acc,
      [id]: mapNullableDefault(acc[id], prev => Math.max(prev, value), value),
    }),
    {},
  )
