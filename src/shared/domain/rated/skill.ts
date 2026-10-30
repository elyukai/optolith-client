import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Skill, SkillCheck } from "@optolith/database-schema/gen"
import { computed } from "mobx"
import type { Global } from "../../global.ts"
import type { Character } from "../character.ts"
import { Case } from "../databaseEnum.ts"
import { CharacterRatedEntries, CharacterRatedEntry, type DisplayedRated } from "./ratedEntry.ts"

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
    return this.getMaxValue(this.dbEntry.check, this.bonusMaximumValue)
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

  override toJSON(): DisplayedSkill {
    const group = this.global.db.getInstanceOfEntityById("SkillGroup", this.dbEntry.group)
    return {
      ...super.toJSON(),
      check: this.dbEntry.check,
      improvementCost: this.improvementCost,
      groupPosition: group?.position ?? 0,
      groupName: this.global.locale.translateMap(group?.translations)?.name,
      translations: this.dbEntry.translations,
      commonness: this.commonness,
    }
  }

  @computed
  get highestRequiredAttribute(): ReturnType<typeof this.getHighestRequiredAssociatedAttribute> {
    return super.getHighestRequiredAssociatedAttribute(this.dbEntry.check, this.bonusMaximumValue)
  }
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedSkill = DisplayedRated & {
  check: SkillCheck
  groupPosition: number
  groupName: string | undefined
  improvementCost: ImprovementCost
  translations: Skill["translations"]
  commonness?: "common" | "uncommon"
}

export class CharacterSkills extends CharacterRatedEntries<"Skill", CharacterSkill> {
  constructor(global: Global, character: Character) {
    super(global, character, "Skill", CharacterSkill)
  }

  @computed
  get skills() {
    return this.entries
  }
}
