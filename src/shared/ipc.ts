import type {
  DerivedCharacteristic_ID,
  Skill_ID,
  SpecialAbilityIdentifier,
} from "@optolith/database-schema/gen"
import type {
  DisplayedActiveActivatable,
  DisplayedInactiveActivatable,
} from "./domain/activatable/activatableEntry.ts"
import type { AdventurePointsStats } from "./domain/character.ts"
import type { DisplayedDerivedCharacteristic } from "./domain/energy.ts"
import type { DisplayedAttribute } from "./domain/rated/attribute.ts"
import type { DisplayedCombatTechnique } from "./domain/rated/combatTechnique.ts"
import type { DisplayedSkill } from "./domain/rated/skill.ts"

export type CharacterIPCActions = {
  incrementDerivedCharacteristic: (id: DerivedCharacteristic_ID) => void
  decrementDerivedCharacteristic: (id: DerivedCharacteristic_ID) => void
  incrementRated: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Skill_ID,
  ) => void
  decrementRated: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Skill_ID,
  ) => void
  incrementRatedToMax: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Skill_ID,
  ) => void
  decrementRatedToMin: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Skill_ID,
  ) => void
}

export type CharacterIPCSelectors = {
  isInCharacterCreation: boolean
  canRemove: boolean
  adventurePointsStats: AdventurePointsStats
  attributes: DisplayedAttribute[]
  attributesTotal: number
  derivedCharacteristics: DisplayedDerivedCharacteristic[]
  activeAdvantages: DisplayedActiveActivatable<"Advantage">[]
  inactiveAdvantages: DisplayedInactiveActivatable<"Advantage">[]
  activeDisadvantages: DisplayedActiveActivatable<"Disadvantage">[]
  inactiveDisadvantages: DisplayedInactiveActivatable<"Disadvantage">[]
  skills: DisplayedSkill[]
  closeCombatTechniques: DisplayedCombatTechnique<"CloseCombatTechnique">[]
  rangedCombatTechniques: DisplayedCombatTechnique<"RangedCombatTechnique">[]
  activeSpecialAbilities: DisplayedActiveActivatable<SpecialAbilityIdentifier["kind"]>[]
  inactiveSpecialAbilities: DisplayedInactiveActivatable<SpecialAbilityIdentifier["kind"]>[]
}

export const defaultCharacterIPCSelectors: CharacterIPCSelectors = {
  isInCharacterCreation: false,
  canRemove: false,
  adventurePointsStats: {
    total: 0,
    spent: 0,
    available: 0,
    spentOnAdvantages: 0,
    spentOnMagicalAdvantages: 0,
    spentOnBlessedAdvantages: 0,
    spentOnDisadvantages: 0,
    spentOnMagicalDisadvantages: 0,
    spentOnBlessedDisadvantages: 0,
    spentOnRace: 0,
    spentOnProfession: 0,
    spentOnAttributes: 0,
    spentOnSkills: 0,
    spentOnCombatTechniques: 0,
    spentOnSpells: 0,
    spentOnCantrips: 0,
    spentOnLiturgicalChants: 0,
    spentOnBlessings: 0,
    spentOnSpecialAbilities: 0,
    spentOnEnergies: 0,
  },
  attributes: [],
  attributesTotal: 0,
  derivedCharacteristics: [],
  activeAdvantages: [],
  inactiveAdvantages: [],
  activeDisadvantages: [],
  inactiveDisadvantages: [],
  skills: [],
  closeCombatTechniques: [],
  rangedCombatTechniques: [],
  activeSpecialAbilities: [],
  inactiveSpecialAbilities: [],
}
