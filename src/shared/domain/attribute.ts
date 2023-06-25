import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Race } from "optolith-database-schema/types/Race"
import { CharacterState } from "../../main_window/slices/characterSlice.ts"
import { filterNonNullable } from "../utils/array.ts"
import { AttributeIdentifier } from "./identifier.ts"
import { Rated } from "./ratedEntry.ts"

export const getAttributeMinimum = (
  characterDerivedCharacteristics: CharacterState["derivedCharacteristics"],
  dynamic: Rated,
): number => {
  // (wiki: StaticDataRecord) =>
  // (hero: HeroModelRecord) =>
  // (mblessed_primary_attr: Maybe<Record<AttributeCombined>>) =>
  // (mhighest_magical_primary_attr: Maybe<Record<AttributeCombined>>) =>

  const isConstitution = dynamic.id === AttributeIdentifier.Constitution

  // const isHighestMagicalPrimaryAttribute =
  //   Maybe.elem (AtDA.id (hero_entry)) (fmap (ACA_.id) (mhighest_magical_primary_attr))

  // const isBlessedPrimaryAttribute =
  //   Maybe.elem (AtDA.id (hero_entry)) (fmap (ACA_.id) (mblessed_primary_attr))

  // const blessedPrimaryAttributeDependencies = HA.blessedPrimaryAttributeDependencies (hero)

  // const magicalPrimaryAttributeDependencies = HA.magicalPrimaryAttributeDependencies (hero)

  const minimumValues = filterNonNullable([
    8,
    // ...flattenDependencies (wiki) (hero) (AtDA.dependencies (hero_entry)),
    isConstitution ? characterDerivedCharacteristics.lifePoints.purchased : undefined,
    // ...(isHighestMagicalPrimaryAttribute
    //   ? [ sel2 (added), ...magicalPrimaryAttributeDependencies.map (x => x.minValue) ]
    //   : []),
    // ...(isBlessedPrimaryAttribute
    //   ? [ sel3 (added), ...blessedPrimaryAttributeDependencies.map (x => x.minValue) ]
    //   : []),
    // fromMaybe (8)
    //           (getSkillCheckAttributeMinimum (
    //             SDA.skills (wiki),
    //             SDA.combatTechniques (wiki),
    //             SDA.spells (wiki),
    //             SDA.liturgicalChants (wiki),
    //             HA.attributes (hero),
    //             HA.skills (hero),
    //             HA.combatTechniques (hero),
    //             HA.spells (hero),
    //             HA.liturgicalChants (hero),
    //             HA.skillCheckAttributeCache (hero),
    //             AtDA.id (hero_entry),
    //           )),
  ])

  return Math.max(...minimumValues)
}

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments
    .find(adjustment =>
      adjustment.list.length > 1
      && adjustment.list.some(attribute => attribute.id.attribute === id))
    ?.value ?? 0

const getModIfStaticAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments
    .filter(adjustment => adjustment.list.length === 1 && adjustment.list[0]!.id.attribute === id)
    .reduce((acc, adjustment) => acc + adjustment.value, 0)

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

export const isAttributeDecreasable = (
  dynamic: Rated,
  min: number,
) => min < dynamic.value

export const isAttributeIncreasable = (
  dynamic: Rated,
  max: number | undefined,
  totalPoints: number,
  maxTotalPoints: number,
  isInCharacterCreation: boolean,
) =>
  (!isInCharacterCreation || totalPoints < maxTotalPoints)
  && (max === undefined || dynamic.value < max)
