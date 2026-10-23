import { isNotNullish } from "@elyukai/utils/nullable"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Attribute, Culture, Skill, SkillCheck } from "@optolith/database-schema/gen"
import { computed } from "mobx"
import type { Database } from "../../database.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import type { Character } from "../character.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  Rated,
  type DisplayedRated,
} from "./ratedEntry.ts"

export class CharacterSkill extends CharacterRatedEntry<"Skill"> {
  get improvementCost(): ImprovementCost {
    return this.dbEntry.improvement_cost.kind
  }

  @computed
  get minValue() {
    const minimumValues = [
      CharacterSkill.minValue,
      // TODO ...flattenMinimumRestrictions(filterApplyingDependencies(this.dependencies)),
    ].filter(isNotNullish)

    return Math.max(...minimumValues)
  }

  @computed
  get maxValue() {
    const maximumValues = [
      Math.max(...this.skillCheckValues.map(scv => scv.value)) + 2,
      this.character.isInCharacterCreation
        ? this.character.experienceLevel.start?.max_skill_rating
        : undefined,
    ].filter(isNotNullish)

    const exceptionalSkillBonus = 0 /* TODO: countOptions(exceptionalSkill, {
      tag: "Skill",
      skill: staticSkill.id,
    }) */

    return Math.min(...maximumValues) + exceptionalSkillBonus
  }

  @computed
  get skillCheckValues() {
    return this.dbEntry.check.map(attributeId => {
      const attribute = this.character.attributes.getByIdSafe(attributeId)
      return {
        id: attributeId,
        value: attribute.value,
        dbEntry: attribute.dbEntry,
      }
    })
  }
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedSkill = DisplayedRated<Skill> & {
  skillCheckValues: { id: string; value: number; dbEntry: Attribute }[]
  groupPosition: number
}

export class CharacterSkills extends CharacterRatedEntries<
  "Skill",
  CharacterSkill,
  { skillCheckValues: { id: string; value: number; dbEntry: Attribute }[]; groupPosition: number }
> {
  #db: Database

  constructor(db: Database, character: Character) {
    super(db, character, "Skill", CharacterSkill)
    this.#db = db
  }

  getAdditionalValuesForDisplay(entry: CharacterSkill) {
    return {
      skillCheckValues: entry.skillCheckValues,
      groupPosition:
        this.#db.getInstanceOfEntityById("SkillGroup", entry.dbEntry.group)?.position ?? 0,
    }
  }

  @computed
  get skills() {
    return this.entries
  }
}

/**
 * The minimum value of a skill.
 */
export const minimumSkillValue = 0

/**
 * Returns the value for a dynamic skill entry that might not exist yet.
 */
export const getSkillValue = (dynamic: Rated | undefined): number =>
  dynamic?.value ?? minimumSkillValue

/**
 * Creates an initial dynamic skill entry.
 */
export const createEmptyDynamicSkill = (id: string): Rated => ({
  id,
  value: minimumSkillValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Returns the highest required attribute and its value for a skill, if any.
 */
export const getHighestRequiredAttributeForSkill = (
  getSingleHighestCheckAttributeId: (check: SkillCheck) => number | undefined,
  staticSkill: Skill,
  dynamicSkill: Rated,
  exceptionalSkill: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const singleHighestAttributeId = getSingleHighestCheckAttributeId(staticSkill.check)

  if (singleHighestAttributeId === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    tag: "Skill",
    skill: staticSkill.id,
  })

  return {
    id: singleHighestAttributeId,
    value: dynamicSkill.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Returns if a skill is common or uncommon for a culture.
 */
export const getSkillCommonness = (
  culture: Pick<Culture, "common_skills" | "uncommon_skills">,
  skill: Skill,
): "common" | "uncommon" | undefined =>
  culture.common_skills.some(({ id: { skill: id } }) => skill.id === id)
    ? "common"
    : (culture.uncommon_skills?.some(({ id: { skill: id } }) => skill.id === id) ?? false)
      ? "uncommon"
      : undefined
