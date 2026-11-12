import { sumWith } from "@elyukai/utils/array/reductions"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Attribute, CombatTechniqueIdentifier } from "@optolith/database-schema/gen"
import { computed } from "mobx"
import { Case } from "../databaseEnum.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  type ConsParamsTrim,
  type DisplayedRated,
} from "./ratedEntry.ts"

export const COMBAT_TECHNIQUE_START_RATING = 6

export class CharacterCombatTechnique<
  Entity extends CombatTechniqueIdentifier["kind"],
> extends CharacterRatedEntry<Entity> {
  static override readonly minValue = COMBAT_TECHNIQUE_START_RATING
  override readonly derivedDependencies = []
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get minValue() {
    return Math.max(CharacterCombatTechnique.minValue, ...this.flatMinimumRestrictions)
  }

  @computed
  get bonusMaximumValue(): number {
    return (
      this.character.maximumSkillRatingBonusEntry?.countOptions(
        Case<CombatTechniqueIdentifier["kind"], string>(this.entityName, this.id),
      ) ?? 0
    )
  }

  @computed
  get maxValue() {
    return this.getMaxValue(
      this.dbEntry.primary_attribute,
      "max_combat_technique_rating",
      this.bonusMaximumValue,
    )
  }

  @computed
  get primaryAttributeValues() {
    return this.getAssociatedAttributeValues(this.dbEntry.primary_attribute)
  }

  @computed
  get attackBase(): number {
    return (
      getPrimaryAttributeModifier([
        this.character.attributes.getValueById(
          this.global.settings.combatTechniques.closeCombatTechniqueAttackAttribute,
        ),
      ]) + this.value
    )
  }

  isEntity<E extends CombatTechniqueIdentifier["kind"]>(
    entity: E,
  ): this is CharacterCombatTechnique<E> {
    return this.entityName === (entity as unknown as Entity)
  }

  @computed
  get parryBase(): Entity extends "CloseCombatTechnique" ? number | undefined : undefined {
    if (
      this.isEntity("CloseCombatTechnique") &&
      this.dbEntry.special.can_parry.kind === "Required"
    ) {
      const base = Math.round(this.value / 2)
      const primaryAttributeModifier = getPrimaryAttributeModifier(
        this.primaryAttributeValues.map(pav => pav.value),
      )
      const otherModifiers = sumWith(
        this.global.settings.combatTechniques.parryModifiers ?? [],
        modifier =>
          this.character.rules.optionalRules.isActive(modifier.source)
            ? (this.character.rules.optionalRules.getOptionValue(modifier.source) ?? 1) *
              modifier.modifier
            : 0,
      )
      return (base +
        primaryAttributeModifier +
        otherModifiers) as Entity extends "CloseCombatTechnique" ? number | undefined : undefined
    }
    return undefined
  }

  override toJSON(): DisplayedCombatTechnique<Entity> | undefined {
    const base = super.toJSON()
    const translation = this.global.locale.translateMap(this.dbEntry.translations)

    if (base === undefined || translation === undefined) {
      return undefined
    }

    return {
      ...base,
      groupPosition: this.entityName === "CloseCombatTechnique" ? 0 : 1,
      type: this.entityName,
      primaryAttributeValues: this.primaryAttributeValues,
      attackBase: this.attackBase,
      parryBase: this.parryBase,
      improvementCost: this.improvementCost,
      name: translation.name,
    }
  }

  @computed
  get highestRequiredAttribute(): ReturnType<typeof this.getHighestRequiredAssociatedAttribute> {
    return super.getHighestRequiredAssociatedAttribute(
      this.dbEntry.primary_attribute,
      this.bonusMaximumValue,
    )
  }
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedCombatTechnique<
  Entity extends CombatTechniqueIdentifier["kind"] = CombatTechniqueIdentifier["kind"],
> = {
  [E in Entity]: DisplayedRated & {
    type: E
    primaryAttributeValues: { id: string; value: number; dbEntry: Attribute }[]
    groupPosition: number
    attackBase: number
    parryBase: E extends "CloseCombatTechnique" ? number | undefined : undefined
    improvementCost: ImprovementCost
    name: string
  }
}[Entity]

export type DisplayedCloseCombatTechnique = DisplayedCombatTechnique<"CloseCombatTechnique">
export type DisplayedRangedCombatTechnique = DisplayedCombatTechnique<"RangedCombatTechnique">

export class CharacterCombatTechniques<
  Entity extends CombatTechniqueIdentifier["kind"],
> extends CharacterRatedEntries<Entity, CharacterCombatTechnique<Entity>> {
  constructor(
    ...args: ConsParamsTrim<
      typeof CharacterRatedEntries<Entity, CharacterCombatTechnique<Entity>>,
      1
    >
  ) {
    super(CharacterCombatTechnique, ...args)
  }

  @computed
  get combatTechniques() {
    return this.entries
  }

  // TODO: Feuerspeien should only be available with special ability, and special ability should not be removable if there are any points in Feuerspeien.
}

const getPrimaryAttributeModifier = (values: number[]): number =>
  // return +1 for every 3 points above 8
  Math.max(Math.floor((Math.max(...values) - 8) / 3), 0)
