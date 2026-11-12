import { on } from "@elyukai/utils/function"
import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import { compareNumber } from "@elyukai/utils/ordering"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { EncumbranceInfluence, SkillCheck } from "@optolith/database-schema/gen"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed } from "mobx"
import { Case } from "../databaseEnum.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  type ConsParamsTrim,
  type DisplayedRated,
} from "./ratedEntry.ts"

export class CharacterSkill extends CharacterRatedEntry<"Skill"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
  override readonly derivedDependencies = []

  @computed
  get minValue() {
    return Math.max(CharacterSkill.minValue, ...this.flatMinimumRestrictions)
  }

  @computed
  get bonusMaximumValue(): number {
    return this.character.maximumSkillRatingBonusEntry?.countOptions(Case("Skill", this.id)) ?? 0
  }

  @computed
  get maxValue(): ReturnType<typeof this.getMaxValue> {
    return this.getMaxValue(this.dbEntry.check, "max_skill_rating", this.bonusMaximumValue)
  }

  @computed
  get skillCheckValues(): ReturnType<typeof this.getAssociatedAttributeValues> {
    return this.getAssociatedAttributeValues(this.dbEntry.check)
  }

  /**
   * If a skill is common or uncommon for a culture.
   */
  @computed
  get commonness(): "common" | "uncommon" | undefined {
    return this.character.culture?.base
      ? this.character.culture.base.common_skills.some(id => this.id === id)
        ? "common"
        : (this.character.culture.base.uncommon_skills?.some(id => this.id === id) ?? false)
          ? "uncommon"
          : undefined
      : undefined
  }

  override toJSON(): DisplayedSkill | undefined {
    const base = super.toJSON()
    const translation = this.global.locale.translateMap(this.dbEntry.translations)
    const group = this.global.db.getInstanceOfEntityById("SkillGroup", this.dbEntry.group)
    const groupTranslation = this.global.locale.translateMap(group?.translations)

    if (
      base === undefined ||
      translation === undefined ||
      group === undefined ||
      groupTranslation === undefined
    ) {
      return undefined
    }

    return {
      ...base,
      check: this.dbEntry.check,
      improvementCost: this.improvementCost,
      groupPosition: group.position,
      groupName: groupTranslation.name,
      name: translation.name,
      commonness: this.commonness,
      encumbranceInfluence: this.dbEntry.encumbrance.kind,
      routine: getMinCheckModForRoutine(
        this.skillCheckValues.map(x => x.value),
        base.value,
        this.character.rules.isOptionalRuleActive(
          this.global.settings.skills.offsettingAttributesForRoutineChecks,
        ),
      ),
    }
  }

  @computed
  get highestRequiredAttribute(): ReturnType<typeof this.getHighestRequiredAssociatedAttribute> {
    return super.getHighestRequiredAssociatedAttribute(this.dbEntry.check, this.bonusMaximumValue)
  }
}

const ROUTINE_ATTR_THRESHOLD = 13

/**
 * Returns the total of missing attribute points for a routine check without
 * using the optional rule for routine checks, because the minimum attribute
 * value is 13 in that case.
 */
const getMissingPoints = (checkAttributeValues: number[]) =>
  checkAttributeValues.reduce(
    (acc, attr) => (attr < ROUTINE_ATTR_THRESHOLD ? acc + (ROUTINE_ATTR_THRESHOLD - attr) : acc),
    0,
  )

/**
 * Returns the minimum check modifier from which a routine check is possible
 * without using the optional rule for routine checks.
 */
const getBaseMinCheckMod = (sr: number) => -Math.floor((sr - 1) / 3) + 3

/**
 * Returns the minimum check modifier from which a routine check is possible for
 * the passed skill rating. Returns `undefined` if no routine check is possible,
 * otherwise a a pair, where the first value is the minimum check
 * modifier and the second a boolean, where `true` states that the minimum check
 * modifier is only valid when using the optional rule for routine checks, thus
 * otherwise a routine check would not be possible.
 */
export const getMinCheckModForRoutine = (
  checkAttributeValues: number[],
  skillRating: number,
  optionalRuleEnabled: boolean,
): number | undefined => {
  // Routine checks do only work if the SR is larger than 0
  if (skillRating <= 0) {
    return undefined
  }

  const missingPoints = getMissingPoints(checkAttributeValues)
  if (missingPoints > 0 && !optionalRuleEnabled) {
    return undefined
  }
  const checkModThreshold = getBaseMinCheckMod(skillRating)
  const dependentCheckMod = checkModThreshold + missingPoints
  return dependentCheckMod < 4 ? dependentCheckMod : undefined
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedSkill = DisplayedRated & {
  check: SkillCheck
  groupPosition: number
  groupName: string
  name: string
  improvementCost: ImprovementCost
  commonness?: "common" | "uncommon"
  encumbranceInfluence: EncumbranceInfluence["kind"]
  routine?: number
}

export type DisplayedSkillGroup = {
  id: string
  check: SkillCheck
  position: number
  name: string
}

export type SkillsByGroup = {
  group: DisplayedSkillGroup
  skillsInGroup: DisplayedSkill[]
}

export class CharacterSkills extends CharacterRatedEntries<"Skill", CharacterSkill> {
  constructor(...args: ConsParamsTrim<typeof CharacterRatedEntries, 2>) {
    super(CharacterSkill, "Skill", ...args)
  }

  @computed
  get skills() {
    return this.entries
  }

  @computed
  get skillsByGroup(): SkillsByGroup[] {
    const { translateMap, compare } = this.global.locale
    return Map.groupBy(
      this.rated
        .values()
        .filter(rated =>
          isEntryFromIncludedPublication(
            rated.dbEntry,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            translateMap,
            this.character.rules.publicationOptions,
          ),
        )
        .map((rated): [string, DisplayedSkill] | undefined =>
          mapNullable(rated.toJSON(), skill => [rated.dbEntry.group, skill]),
        )
        .filter(isNotNullish),
      ([group]) => group,
    )
      .entries()
      .map(([groupId, skillsInGroup]) => {
        const group = this.global.db.getInstanceOfEntityById("SkillGroup", groupId)
        const groupTranslation = mapNullable(group, g => translateMap(g.translations))

        if (group === undefined || groupTranslation === undefined) {
          return undefined
        }

        return {
          group: {
            id: groupId,
            check: group.check,
            position: group.position,
            name: groupTranslation.name,
          },
          skillsInGroup: skillsInGroup.map(([, skill]) => skill).toSorted(on(x => x.name, compare)),
        }
      })
      .filter(isNotNullish)
      .toArray()
      .toSorted(on(x => x.group.position, compareNumber))
  }
}
