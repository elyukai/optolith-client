import { isNotNullish } from "@elyukai/utils/nullable"
import type { Attribute, Culture, Skill, SkillCheck, Skill_ID } from "@optolith/database-schema/gen"
import { action, computed, get, observable } from "mobx"
import type { Database } from "../../database.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import { addAdventurePointsCaches, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BoundAdventurePointsForRated } from "../adventurePoints/ratedEntry.ts"
import type { Character } from "../character.ts"
import { CharacterRatedEntry, Rated, type DisplayedRated } from "./ratedEntry.ts"

export class CharacterSkill extends CharacterRatedEntry {
  #character: Character

  readonly dbEntry: Skill

  constructor(
    id: string,
    dbEntry: Skill,
    character: Character,
    value: number,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    super(() => this.dbEntry.improvement_cost.kind, id, value, boundAdventurePoints)
    this.#character = character
    this.dbEntry = dbEntry
  }

  static createEmpty(id: string, dbEntry: Skill | undefined, character: Character): CharacterSkill {
    if (!dbEntry) {
      throw new Error(`Skill with id ${id} not provided.`)
    }
    return new CharacterSkill(id, dbEntry, character, CharacterSkill.minValue, [])
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
      this.#character.isInCharacterCreation
        ? this.#character.experienceLevel.start?.max_skill_rating
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
      const attribute = this.#character.attributes.getByIdSafe(attributeId)
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
export type DisplayedSkill = DisplayedRated &
  Skill & {
    skillCheckValues: { id: string; value: number; dbEntry: Attribute }[]
    groupPosition: number
  }

export class CharacterSkills {
  #db: Database
  #character: Character
  @observable accessor #skills: Record<string, CharacterSkill> = {}

  constructor(db: Database, character: Character) {
    this.#db = db
    this.#character = character
  }

  getById(id: Skill_ID): CharacterSkill | undefined {
    return get(this.#skills, id)
  }

  getValueById(id: Skill_ID): number {
    return this.getById(id)?.value ?? CharacterSkill.minValue
  }

  @computed
  get skills() {
    return this.#db.getAllInstanceContainersOfEntity("Skill").map((container): DisplayedSkill => {
      const entry =
        this.getById(container.id) ??
        CharacterSkill.createEmpty(container.id, container.content, this.#character)

      return {
        ...entry.toJSON(),
        ...container.content,
        groupPosition:
          this.#db.getInstanceOfEntityById("SkillGroup", container.content.group)?.position ?? 0,
        skillCheckValues: entry.skillCheckValues,
      }
    })
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#skills).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
      emptyAdventurePointsCache,
    )
  }

  #ensureEntryExists(id: Skill_ID): CharacterSkill {
    if (!this.#skills[id]) {
      this.#skills[id] = CharacterSkill.createEmpty(
        id,
        this.#db.getInstanceOfEntityById("Skill", id),
        this.#character,
      )
    }
    return this.#skills[id]
  }

  @action
  increment(id: Skill_ID) {
    this.#ensureEntryExists(id).increment()
  }

  @action
  decrement(id: Skill_ID) {
    this.#ensureEntryExists(id).decrement()
  }

  @action
  incrementToMax(id: Skill_ID) {
    this.#ensureEntryExists(id).incrementToMax()
  }

  @action
  decrementToMin(id: Skill_ID) {
    this.#ensureEntryExists(id).decrementToMin()
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
