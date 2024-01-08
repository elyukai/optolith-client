import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { AttributeAdjustments } from "optolith-database-schema/types/Race"
import { filterNonNullable } from "../../utils/array.ts"
import { mapNullable, mapNullableDefault } from "../../utils/nullable.ts"
import { Activatable } from "../activatable/activatableEntry.ts"
import { All, GetById } from "../getTypes.ts"
import { getSingleHighestPair } from "../idValue.ts"
import { AttributeIdentifier } from "../identifier.ts"
import { getAttributeValue } from "./attribute.ts"
import { getHighestRequiredAttributeForCombatTechnique } from "./combatTechnique.ts"
import { getHighestRequiredAttributeForLiturgicalChant } from "./liturgicalChant.ts"
import { RatedDependency, flattenMinimumRestrictions } from "./ratedDependency.ts"
import { Rated } from "./ratedEntry.ts"
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
  dynamicEntries: D[],
  getStaticEntryById: (id: number) => S | undefined,
  getHighestRequiredAttributeForEntry: (
    dynamicEntry: D,
    staticEntry: S,
  ) => { id: number; value: number } | undefined,
): { id: number; value: number }[] =>
  dynamicEntries.flatMap(dynamicEntry =>
    // optimize performance by filtering out all entries that are below the
    // attribute minimum of 8
    (dynamicEntry.value ?? 0) < 8
      ? []
      : mapNullableDefault(
          mapNullable(getStaticEntryById(dynamicEntry.id), staticEntry =>
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
  getStaticSkillById: GetById.Static.Skill,
  getStaticCloseCombatTechniqueById: GetById.Static.CloseCombatTechnique,
  getStaticRangedCombatTechniqueById: GetById.Static.RangedCombatTechnique,
  getStaticSpellById: GetById.Static.Spell,
  getStaticRitualById: GetById.Static.Ritual,
  getStaticLiturgicalChantById: GetById.Static.LiturgicalChant,
  getStaticCeremonyById: GetById.Static.Ceremony,
  getStaticCurseById: GetById.Static.Curse,
  getStaticElvenMagicalSongById: GetById.Static.ElvenMagicalSong,
  getStaticDominationRitualById: GetById.Static.DominationRitual,
  getStaticMagicalDanceById: GetById.Static.MagicalDance,
  getStaticMagicalMelodyById: GetById.Static.MagicalMelody,
  getStaticJesterTrickById: GetById.Static.JesterTrick,
  getStaticAnimistPowerById: GetById.Static.AnimistPower,
  getStaticGeodeRitualById: GetById.Static.GeodeRitual,
  getStaticZibiljaRitualById: GetById.Static.ZibiljaRitual,
  getDynamicAttributeById: GetById.Dynamic.Attribute,
  dynamicSkills: All.Dynamic.Skills,
  dynamicCloseCombatTechniques: All.Dynamic.CloseCombatTechniques,
  dynamicRangedCombatTechniques: All.Dynamic.RangedCombatTechniques,
  dynamicSpells: All.Dynamic.Spells,
  dynamicRituals: All.Dynamic.Rituals,
  dynamicLiturgicalChants: All.Dynamic.LiturgicalChants,
  dynamicCeremonies: All.Dynamic.Ceremonies,
  dynamicCurses: All.Dynamic.Curses,
  dynamicElvenMagicalSongs: All.Dynamic.ElvenMagicalSongs,
  dynamicDominationRituals: All.Dynamic.DominationRituals,
  dynamicMagicalDances: All.Dynamic.MagicalDances,
  dynamicMagicalMelodies: All.Dynamic.MagicalMelodies,
  dynamicJesterTricks: All.Dynamic.JesterTricks,
  dynamicAnimistPowers: All.Dynamic.AnimistPowers,
  dynamicGeodeRituals: All.Dynamic.GeodeRituals,
  dynamicZibiljaRituals: All.Dynamic.ZibiljaRituals,
  exceptionalSkill: Activatable | undefined,
  exceptionalCombatTechnique: Activatable | undefined,
): Record<number, number> => {
  const getSingleHighestPrimaryAttributeId = (primaryAttributeIds: number[]) =>
    getSingleHighestPair(
      primaryAttributeIds.map(id => ({
        id,
        value: getAttributeValue(getDynamicAttributeById(id)),
      })),
    )?.id

  return [
    ...getAttributeMinimaForEntity(dynamicSkills, getStaticSkillById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSkill(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCloseCombatTechniques,
      getStaticCloseCombatTechniqueById,
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
      getStaticRangedCombatTechniqueById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForCombatTechnique(
          getSingleHighestPrimaryAttributeId,
          { tag: "RangedCombatTechnique", rangedCombatTechnique: staticEntry },
          dynamicEntry,
          exceptionalCombatTechnique,
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicSpells, getStaticSpellById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        exceptionalSkill,
        "Spell",
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicRituals,
      getStaticRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "Ritual",
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicLiturgicalChants,
      getStaticLiturgicalChantById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "LiturgicalChant",
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicCeremonies,
      getStaticCeremonyById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForLiturgicalChant(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          exceptionalSkill,
          "Ceremony",
        ),
    ),
    ...getAttributeMinimaForEntity(dynamicCurses, getStaticCurseById, (dynamicEntry, staticEntry) =>
      getHighestRequiredAttributeForSpellwork(
        check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
        staticEntry,
        dynamicEntry,
        undefined,
        undefined,
      ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicElvenMagicalSongs,
      getStaticElvenMagicalSongById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicDominationRituals,
      getStaticDominationRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalDances,
      getStaticMagicalDanceById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicMagicalMelodies,
      getStaticMagicalMelodyById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicJesterTricks,
      getStaticJesterTrickById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicAnimistPowers,
      getStaticAnimistPowerById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicGeodeRituals,
      getStaticGeodeRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
          staticEntry,
          dynamicEntry,
          undefined,
          undefined,
        ),
    ),
    ...getAttributeMinimaForEntity(
      dynamicZibiljaRituals,
      getStaticZibiljaRitualById,
      (dynamicEntry, staticEntry) =>
        getHighestRequiredAttributeForSpellwork(
          check => getSingleHighestCheckAttributeId(getDynamicAttributeById, check),
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
