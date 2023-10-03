import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { AttributeAdjustments } from "optolith-database-schema/types/Race"
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
import { filterNonNullable } from "../utils/array.ts"
import { mapNullable, mapNullableDefault } from "../utils/nullable.ts"
import { Activatable } from "./activatableEntry.ts"
import { getAttributeValue } from "./attribute.ts"
import { getHighestRequiredAttributeForCombatTechnique } from "./combatTechnique.ts"
import { getSingleHighestPair } from "./idValue.ts"
import { AttributeIdentifier } from "./identifier.ts"
import { getHighestRequiredAttributeForLiturgicalChant } from "./liturgicalChant.ts"
import { RatedDependency, flattenMinimumRestrictions } from "./rated/ratedDependency.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedWithEnhancementsMap,
  Rated,
  RatedMap,
} from "./ratedEntry.ts"
import { getHighestRequiredAttributeForSkill } from "./skill.ts"
import { getSingleHighestCheckAttributeId } from "./skillCheck.ts"
import { getHighestRequiredAttributeForSpellwork } from "./spell.ts"

/**
 * Returns the minimum value for an attribute.
 */
export const getAttributeMinimum = (
  purchasedLifePoints: number,
  purchasedArcaneEnergy: number,
  purchasedKarmaPoints: number,
  singleHighestMagicalPrimaryAttributeId: number | undefined,
  magicalPrimaryAttributeDependencies: RatedDependency[],
  blessedPrimaryAttributeId: number | undefined,
  blessedPrimaryAttributeDependencies: RatedDependency[],
  filterApplyingDependencies: (dependencies: RatedDependency[]) => RatedDependency[],
  getSkillCheckAttributeMinimum: (id: number) => number | undefined,
  dynamicAttribute: Rated,
): number => {
  const { id } = dynamicAttribute
  const isConstitution = id === AttributeIdentifier.Constitution
  const isHighestMagicalPrimaryAttribute = id === singleHighestMagicalPrimaryAttributeId
  const isBlessedPrimaryAttribute = id === blessedPrimaryAttributeId

  const minimumValues = filterNonNullable([
    8,
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicAttribute.dependencies)),
    isConstitution ? purchasedLifePoints : undefined,
    ...(isHighestMagicalPrimaryAttribute
      ? [
          purchasedArcaneEnergy,
          ...flattenMinimumRestrictions(
            filterApplyingDependencies(magicalPrimaryAttributeDependencies),
          ),
        ]
      : []),
    ...(isBlessedPrimaryAttribute
      ? [
          purchasedKarmaPoints,
          ...flattenMinimumRestrictions(
            filterApplyingDependencies(blessedPrimaryAttributeDependencies),
          ),
        ]
      : []),
    getSkillCheckAttributeMinimum(id),
  ])

  return Math.max(...minimumValues.flat())
}

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment = (id: number, staticAttributeAdjustments: AttributeAdjustments) =>
  staticAttributeAdjustments.selectable?.find(adjustment =>
    adjustment.list.some(attribute => attribute.id.attribute === id),
  )?.value ?? 0

const getModIfStaticAdjustment = (id: number, staticAttributeAdjustments: AttributeAdjustments) =>
  staticAttributeAdjustments.fixed
    ?.filter(adjustment => adjustment.id.attribute === id)
    .reduce((acc, adjustment) => acc + adjustment.value, 0) ?? 0

/**
 * Returns the maximum value for an attribute.
 */
export const getAttributeMaximum = (
  isInCharacterCreation: boolean,
  staticAttributeAdjustments: AttributeAdjustments,
  startExperienceLevel: ExperienceLevel,
  currentExperienceLevel: ExperienceLevel,
  isAttributeValueLimitEnabled: boolean,
  adjustmentId: number | undefined,
  dynamicAttribute: Rated,
): number | undefined => {
  const { id } = dynamicAttribute

  if (isInCharacterCreation) {
    const selectedAdjustment =
      adjustmentId === id ? getModIfSelectedAdjustment(id, staticAttributeAdjustments) : 0
    const staticAdjustment = getModIfStaticAdjustment(id, staticAttributeAdjustments)

    return startExperienceLevel.max_attribute_value + selectedAdjustment + staticAdjustment
  }

  if (isAttributeValueLimitEnabled) {
    return currentExperienceLevel.max_attribute_value + 2
  }

  return undefined
}

/**
 * Checks if the attribute is decreasable.
 * @param dynamicEntry The dynamic attribute entry.
 * @param min The value returned from {@link getAttributeMinimum}.
 */
export const isAttributeDecreasable = (dynamicEntry: Rated, min: number) => min < dynamicEntry.value

/**
 * Checks if the attribute is increasable.
 * @param dynamicEntry The dynamic attribute entry.
 * @param max The value returned from {@link getAttributeMaximum}.
 * @param totalPoints The current sum of all attribute values.
 * @param maxTotalPoints The maximum sum of all attribute values.
 */
export const isAttributeIncreasable = (
  dynamicEntry: Rated,
  max: number | undefined,
  totalPoints: number,
  maxTotalPoints: number,
  isInCharacterCreation: boolean,
) =>
  (!isInCharacterCreation || totalPoints < maxTotalPoints) &&
  (max === undefined || dynamicEntry.value < max)

const getAttributeMinimaForEntity = <
  D extends { id: number; value: number | undefined },
  S extends object,
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
 * 2, maybe further increased by entries such as *Exceptional Skill*
 * or *Exceptional Combat Technique*.
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
): Record<number, number> => {
  const getSingleHighestPrimaryAttributeId = (primaryAttributeIds: number[]) =>
    getSingleHighestPair(
      primaryAttributeIds.map(id => ({ id, value: getAttributeValue(attributes[id]) })),
    )?.id

  return [
    ...getAttributeMinimaForEntity(dynamicSkills, staticSkills, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSkill(
        check => getSingleHighestCheckAttributeId(id => attributes[id], check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCloseCombatTechniques,
      staticCloseCombatTechniques,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          getSingleHighestPrimaryAttributeId,
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
          getSingleHighestPrimaryAttributeId,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicSpells, staticSpells, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(id => attributes[id], check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
        "Spell",
      ),
    ),
    ...getAttributeMinimaForEntity(dynamicRituals, staticRituals, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(id => attributes[id], check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
        "Ritual",
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicLiturgicalChants,
      staticLiturgicalChants,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "LiturgicalChant",
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCeremonies,
      staticCeremonies,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "Ceremony",
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicCurses, staticCurses, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(id => attributes[id], check),
        staticEntry,
        dynamicEntry,
        undefined,
        undefined,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicElvenMagicalSongs,
      staticElvenMagicalSongs,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicDominationRituals,
      staticDominationRituals,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalDances,
      staticMagicalDances,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalMelodies,
      staticMagicalMelodies,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicJesterTricks,
      staticJesterTricks,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicAnimistPowers,
      staticAnimistPowers,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicGeodeRituals,
      staticGeodeRituals,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicZibiljaRituals,
      staticZibiljaRituals,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(id => attributes[id], check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
  ].reduce<Record<number, number>>(
    (acc, { id, value }) => ({
      ...acc,
      [id]: mapNullableDefault(acc[id], prev => Math.max(prev, value), value),
    }),
    {},
  )
}
